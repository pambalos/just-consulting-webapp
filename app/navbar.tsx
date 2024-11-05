import Container from "react-bootstrap/Container";
import {NavbarBrand, NavbarCollapse, NavLink} from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import Nav from "react-bootstrap/Nav";

import { CgProfile } from "react-icons/cg";
import StudioLink from "@/app/(frontend)/components/studioLink";
import ShopLink from "@/app/(frontend)/components/shoplink";
import UserLogButton from "@/app/(frontend)/components/userLogButton";
import Cart from "@/app/(frontend)/shop/cart";

export default function SiteNavbar({session} : {session: any}) {
    //get first path param
    return (
        <div className={"nav-wrapper"}>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
                crossOrigin="anonymous"
            />
            <Navbar expanded={true} expand="sm" data-bs-theme="dark" className="bg-body-tertiary justify-content-between main-nav">
                <Container>
                    <NavbarBrand href="/">JustConsulting</NavbarBrand>
                    {/*<NavbarToggle aria-controls="basic-navbar-nav" />*/}
                    <NavbarCollapse id={"basic-navbar-nav"}>
                        <Nav className={"me-auto left-1"} >
                            {/*<NavLink id={"blog-link"} key={"home"} href={"/"}>Blog</NavLink>*/}
                            {/*<NavLink id={"session-link"} key={"session-details"} href={"/account"}>Session Details</NavLink>*/}
                        </Nav>
                        <Nav className={"right-1"}>
                            <StudioLink session={session}/>
                            <ShopLink session={session}/>
                            <UserLogButton session={session}/>
                            {
                                session?.user &&
                                <NavLink id={"profile-link"} href={"/profile"}><CgProfile/></NavLink>
                            }
                            <Cart/>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
            {/*{*/}
            {/*    session?.user &&*/}
            {/*    <Cart />*/}
            {/*}*/}
        </div>
    )
}