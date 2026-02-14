import { fetchStocks } from "@/app/actions/stocks";
import UpdateForm from "./UpdateForm";

type Stock = {
  name: string;
  BUY: number;
};

export default async function EditPage({
  params,
}: {
  params: { name: string } | Promise<{ name: string }>;
}) {
  const result = await fetchStocks();
  const stocks: Stock[] = Array.isArray(result?.data)
    ? result.data.filter(
        (item): item is Stock =>
          typeof item?.name === "string" && typeof item?.BUY === "number"
      )
    : [];
  const resolvedParams =
    typeof (params as Promise<{ name: string }>)?.then === "function"
      ? await (params as Promise<{ name: string }>)
      : (params as { name: string });
  const routeName =
    typeof resolvedParams?.name === "string"
      ? decodeURIComponent(resolvedParams.name)
      : "";

  const stock = stocks.find((s) => routeName && s.name.toLowerCase() === routeName.toLowerCase());

  if (!stock) {
    return <div>Stock not found</div>;
  }

  return (
    <div>
      <h2>Edit {stock.name}</h2>
      <UpdateForm stock={stock} />
    </div>
  );
}
