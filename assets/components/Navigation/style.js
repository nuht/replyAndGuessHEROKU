import {Link} from "react-router-dom";


export const NavbarLinks = styled(Link)`
    text-decoration: none;
    color: ${(props) => props.active ? 'white' : 'black'};
`;
