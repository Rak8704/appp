
import AdminCrudPage from "@/components/admin/admin-crud-page";

export default function AdsPage() {
  return (
    <AdminCrudPage
      config={{
        title: "Advertisement Management",
        description: "Manage advertisements, banners, positions and campaigns.",
        endpoint: "/api/admin/ads",
        fields: [
          { name: "title", label: "Advertisement Title", required: true },
          { name: "imageUrl", label: "Banner Image URL", type: "url", nullable: true },
          { name: "targetUrl", label: "Target / Click URL", type: "url", nullable: true },
          {
            name: "position",
            label: "Advertisement Position",
            type: "select",
            required: true,
            options: [
              { label: "Header", value: "HEADER" },
              { label: "Homepage Top", value: "HOMEPAGE_TOP" },
              { label: "Homepage Sidebar", value: "HOMEPAGE_SIDEBAR" },
              { label: "Article Top", value: "ARTICLE_TOP" },
              { label: "Article Sidebar", value: "ARTICLE_SIDEBAR" },
              { label: "Footer", value: "FOOTER" },
            ],
          },
          { name: "startDate", label: "Start Date", type: "date", nullable: true },
          { name: "endDate", label: "End Date", type: "date", nullable: true },
          { name: "sortOrder", label: "Sort Order", placeholder: "0" },
          { name: "isActive", label: "Advertisement Active", type: "checkbox" },
        ],
        columns: [
          { key: "title", label: "Title" },
          { key: "position", label: "Position" },
          { key: "sortOrder", label: "Order" },
          { key: "isActive", label: "Status" },
          { key: "startDate", label: "Start Date" },
        ],
      }}
    />
  );
}
