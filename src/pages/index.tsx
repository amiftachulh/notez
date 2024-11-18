import Container from "@/components/container";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container className="p-3">
        <div className="mx-auto max-w-[1920px] p-3">
          <h1>Home</h1>
          <p>Home page content</p>
        </div>
      </Container>
    </>
  );
}
