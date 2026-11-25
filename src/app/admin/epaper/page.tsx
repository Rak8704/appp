
import AdminCrudPage from "@/components/admin/admin-crud-page";

export default function EpaperPage() {
  return (
    <AdminCrudPage
      config={{
        title: "E-paper Management",
        description: "Manage newspaper editions, PDF files and publication.",
        endpoint: "/api/admin/epaper",
        fields: [
          { name: "title", label: "Edition Title", required: true },
          { name: "editionDate", label: "Edition Date", type: "date", required: true },
          { name: "pdfUrl", label: "PDF File URL", type: "url", required: true },
          { name: "coverImage", label: "Cover Image URL", type: "url", nullable: true },
          { name: "isPublished", label: "Publish E-paper", type: "checkbox" },
        ],
        columns: [
          { key: "title", label: "Edition" },
          { key: "editionDate", label: "Edition Date" },
          { key: "pdfUrl", label: "PDF URL" },
          { key: "isPublished", label: "Published" },
          { key: "createdAt", label: "Created" },
        ],
      }}
    />
  );
}
