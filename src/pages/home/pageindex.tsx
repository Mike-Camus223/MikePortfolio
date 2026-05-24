import MainLayout from "../../templates/MainLayout";
import HomeTemplate from "../../templates/HomeTemplate";

export default function PageIndex() {
  return (
    <MainLayout OnNavbar={true} OnFooter={true}>
      <HomeTemplate />
    </MainLayout>
  );
}
