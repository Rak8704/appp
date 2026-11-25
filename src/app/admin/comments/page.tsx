
import AdminModulePage from "@/components/admin/admin-module-page";

export default function MediaPage() {
  return (
    <AdminModulePage
      title="Media Library"
      description="Manage uploaded images, videos, documents, and other media files."
      api="/api/admin/media"
    />
  );
}
