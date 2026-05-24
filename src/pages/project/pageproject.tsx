import MainLayout from "../../templates/MainLayout";
import ProjectTemplate from "../../templates/ProjectTemplate";

export default function PageProject() {
  return (
    <MainLayout OnNavbar={false} OnFooter={false}>
      <ProjectTemplate />
    </MainLayout>
  );
}
