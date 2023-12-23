import { Navbar } from "@/components";
import CardContent from "@/components/CardContent";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";



type Idea = {
  id: number;
  published_at: string;
  title: string;
  small_image: string;
  medium_image: string;
};

type Props = {
  ideas: Idea[];
};
export default function Home({ ideas }: any) {
  const [perPage, setPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"published_at" | "-published_at">(
    "-published_at"
  );
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(ideas);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fecthData = async () => {
      try {
        const response = await axios.get(
          `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=-${sortBy}`
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error: ", error);
        setLoading(false);
      }
    };
    fecthData();
  }, [perPage, sortBy, currentPage]);

  const handlePerPageChange = (perPageValue: number) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  const handleSortChange = (sortValue: "published_at" | "-published_at") => {
    setSortBy(sortValue);
    setCurrentPage(1);
  };
  const handlePerChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const generatePages = () => {
    const pages = [];
    const totalPages = Math.ceil(ideas.meta.total / perPage);
    const max = 5;
    let startPage = Math.max(currentPage - Math.floor(max / 2), 1);
    let endPage = Math.min(startPage + max - 1, totalPages);
    if (totalPages <= max) {
      startPage = 1;
      endPage = totalPages;
    } else if (endPage - startPage < max - 1) {
      startPage = endPage - max + 1;
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <>
      <Navbar />
      <div
        className="h-[85vh] mt-[15vh] bg-cover bg-center inset-0 clip-triangle"
        style={{
          backgroundImage: `url("/6.jpg")`,
        }}>
        <div className="top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute font-poppins">
          <p className="text-white text-6xl rounded-[8px] text-center">Ideas</p>
          <p className="text-white text-xl rounded-[8px] text-center">
            Where all our great things begin
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center px-[128px] py-[16px]">
        <p>
          Showing: {currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1} -{" "}
          {Math.min(currentPage * perPage, ideas.meta.total)} of{" "}
          {ideas.meta.total}
        </p>
        <div className="flex flex-row justify-between items-center gap-5">
          <p>Show per page: </p>
          <select onChange={(e) => handlePerPageChange(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <p>Sort by:</p>
          <select
            onChange={(e) =>
              handleSortChange(
                e.target.value as "published_at" | "-published_at"
              )
            }>
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>
      {loading && <p>Loading</p>}
      <CardContent ideas={data.data} />
      <div className="flex flex-row justify-center items-center gap-6 pb-[32px]">
        <button
          onClick={() => handlePerChange(1)}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? "opacity-50" : ""}`}>
          <Image src="/chevron-double-left.svg" alt="" height={24} width={24} />
        </button>
        <button
          onClick={() => handlePerChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? "opacity-50" : ""}`}>
          <Image src="/left-fill.svg" alt="" height={24} width={24} />
        </button>
        <div>
          {generatePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePerChange(page)}
              className={`${
                currentPage === page ? "bg-primary text-white" : "text-primary"
              } gap-2 p-3 rounded-[4px]`}>
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePerChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(ideas.meta.total / perPage)}
          className={`${
            currentPage === Math.ceil(ideas.meta.total / perPage)
              ? "opacity-50"
              : ""
          }`}>
          <Image src="/right-fill.svg" alt="" height={24} width={24} />
        </button>
        <button
          onClick={() => handlePerChange(Math.ceil(ideas.meta.total / perPage))}
          disabled={currentPage === Math.ceil(ideas.meta.total / perPage)}
          className={`${
            currentPage === Math.ceil(ideas.meta.total / perPage)
              ? "opacity-50"
              : ""
          }`}>
          <Image
            src="/chevron-double-right.svg"
            alt=""
            height={24}
            width={24}
          />
        </button>
      </div>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(
      `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=50&append[]=small_image&append[]=medium_image&sort=-published_at`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    return {
      props: {
        ideas: data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ideas: [],
      },
    };
  }
};
