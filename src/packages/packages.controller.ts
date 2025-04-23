import { Request, Response } from "express";
import * as cheerio from "cheerio";
import axios from "axios";

type CompanyType =
  | "partner"
  | "golan"
  | "hot"
  | "pelephone"
  | "cellcom"
  | "zero19"
  | "ramilevi"
  | "wecom";

type SubcategoryType =
  | "personal"
  | "family"
  | "dataOnly"
  | "kids"
  | "kosher"
  | "travel"
  | "business";

type DataUseType = "low" | "medium" | "high";

type TechType = "fiveG" | "fourG" | "any";

type PackageType = {
  name: string;
  price: number;
  company_id: string;
};

type CategoryType =
  | "cellular"
  | "tv"
  | "internet"
  | "fiber"
  | "electricity"
  | "phones";

const companyIds: Record<CompanyType, string[]> = {
  partner: ["31"],
  golan: ["36"],
  hot: ["34"],
  pelephone: ["32"],
  cellcom: ["30"],
  zero19: ["37"],
  ramilevi: ["38"],
  wecom: ["35"],
};

const categoryIds: Record<CategoryType, string> = {
  cellular: "2",
  tv: "4",
  internet: "3",
  fiber: "1",
  electricity: "17",
  phones: "mobiles",
};

const subcategoryIds: Record<SubcategoryType, string[]> = {
  personal: ["dynamic"],
  family: ["39", "38"],
  dataOnly: ["37"],
  kids: ["110"],
  kosher: ["36"],
  travel: ["382"],
  business: ["442"],
};

const dataUseIds: Record<DataUseType, string[]> = {
  low: ["Low"],
  medium: ["Medium"],
  high: ["High"],
};

const techIds: Record<TechType, string[]> = {
  fiveG: ["70"],
  fourG: ["300"],
  any: ["NA"],
};

export const getPackages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const category = req.query.category as CategoryType | undefined;
  const company = req.query.company as CompanyType | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const subcategory = req.query.subcategory as SubcategoryType | undefined;
  const dataUse = req.query.dataUse as DataUseType | undefined;
  const tech = req.query.tech as TechType | undefined;
  const numOfLines = req.query.numOfLines as "2" | "3" | "4" | "5" | undefined;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  if (category === "phones") {
    const { error, packages, total } = await getPhones();
    return res.json({ products: packages, total_count: total });
  }

  if (category === "cellular") {
    const { error, packages, total } = await getCellularPackages(
      company,
      page,
      subcategory,
      dataUse,
      tech,
      numOfLines
    );
    return res.send({ products: packages, total_count: total });
  }

  try {
    const url = "https://www.zolzolzol.co.il/categories/getProductAjax";
    const body = `categoryId=${categoryIds[category]}&page=${page}`;

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    res.json({
      products: response.data.products,
      total_count: response.data.total_count,
    });
  } catch (error) {
    console.error("Error:", (error as Error).message);
    res.status(500).json({ error: "Failed to fetch packages." });
  }
};

const getCellularPackages = async (
  company: CompanyType | undefined,
  page: number,
  subcategory: SubcategoryType | undefined,
  dataUse: DataUseType | undefined,
  tech: TechType | undefined,
  numOfLines: "2" | "3" | "4" | "5" | undefined
) => {
  const url = "https://www.zolzolzol.co.il/ajax/getProductsByFillters";

  const formData: { value: string[]; category: string }[] = [];

  if (company) {
    formData.push({ value: companyIds[company], category: "company" });
  }

  if (subcategory) {
    formData.push({ value: subcategoryIds[subcategory], category: "29" });
  }

  if (numOfLines) {
    formData.push({ value: [numOfLines], category: "36" });
  }

  if (dataUse) {
    formData.push({ value: dataUseIds[dataUse], category: "25" });
  }

  if (tech && tech !== "any") {
    formData.push({ value: techIds[tech], category: "31" });
  }

  const body = formData
    .map(({ value, category }, index) => {
      const valuePart = value
        .map((val) => `filters[${index}][value]=${val}`)
        .join("&");

      const categoryPart = `filters[${index}][category]=${category}`;

      return `${categoryPart}&${valuePart}`;
    })
    .join("&");

  try {
    const response = await axios.post(url, body);
    let packages = response.data.data || [];
    packages = packages.filter((pkg: any) => pkg.category_id === "2");

    // Implement pagination
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPackages = packages.slice(startIndex, endIndex);

    return {
      error: null,
      packages: paginatedPackages,
      total: packages.length, // Optional: return total count for reference
    };
  } catch (error) {
    return { error, packages: [], total: 0 };
  }
};

export const getCarousel = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://www.zolzolzol.co.il");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();

    const $ = cheerio.load(html);
    const regex = /const\s+images\s*=\s*JSON\.parse\(\s*'(.*?)'\s*\)\s*;/;
    let jsonData: any[] = [];

    $("script").each((_, el) => {
      const match = $(el).html()?.match(regex);
      if (match) {
        try {
          jsonData = JSON.parse(match[1]);
          return false; // stop iterating
        } catch (err) {
          console.error("Error parsing JSON:", (err as Error).message);
          return false;
        }
      }
    });

    const result = jsonData.map((item) => ({
      imageUrl: `https://www.zolzolzol.co.il/${item.image}`,
      productId: item.link?.trim().match(/(\d+)\/?$/)?.[1] || null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error:", (error as Error).message);
    res.status(500).json({ error: "Failed to fetch carousel data." });
  }
};

const getPhones = async () => {
  const url = `https://www.zolzolzol.co.il/mobiles`;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const products: any[] = [];

    $(".card.h-100.shadow").each((i, el) => {
      const title = $(el).find(".card-body p.mb-0").text().trim();

      const priceText = $(el).find(".price.text-primary").text();
      const priceMatch = priceText.replace(/,/g, "").match(/\d+/); // handles ₪8,532 too
      const price = priceMatch ? parseInt(priceMatch[0]) : null;

      const imageUrl = $(el).find("img.card-img-top").attr("src");

      products.push({ title, price, imageUrl });
    });

    return { error: null, packages: products, total: products.length };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      packages: [],
      total: 0,
    };
  }
};
