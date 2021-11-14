import styled from "styled-components";

export const NavbarLinks = styled.div`
  a {
    text-decoration: none;
    color: ${(props) => props.active ? 'white' : 'black'};
  }
`;
