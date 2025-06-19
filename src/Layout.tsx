import { Outlet, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function Layout() {
  const {pathname} = useLocation()

  const hideOn = ['/login', '/register']
  const hideLayout = hideOn.some(path => pathname.startsWith(path));

  return (
  <>
    {!hideLayout && <Nav/>}
    <main>
      <Outlet />
    </main>
      {!hideLayout && <Footer />}
  </>
  )
}
