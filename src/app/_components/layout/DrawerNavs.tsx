"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

const navs = [
  { label: "Home", icon: <HomeIcon />, href: "/home" },
  { label: "Master Product", icon: <CategoryIcon />, href: "/master-products" },
  { label: "Pokemon", icon: <CatchingPokemonIcon />, href: "/pokemon" },
];

export const dynamic = "force-dynamic";

export default function UserPageLayoutDrawerNavs() {
  const pathName = usePathname();

  const isSelected = (href: string) => {
    const pathSplitted = pathName.split("/");
    return "/" + pathSplitted[1] === href;
  };

  const currNavs = navs;

  return (
    <Stack justifyContent="space-between" sx={{ height: "100%" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemAvatar>Logo</ListItemAvatar>
          </ListItemButton>
        </ListItem>
        {currNavs.map((nav, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              LinkComponent={Link}
              href={nav.href}
              selected={isSelected(nav.href)}
            >
              <ListItemIcon>{nav.icon}</ListItemIcon>
              <ListItemText primary={nav.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export const USER_NAVS = navs;
