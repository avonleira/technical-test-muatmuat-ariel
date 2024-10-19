"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { RootState, AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { Product } from "@/types/product";
import UserPageLayout from "../_components/layout";
import ProductCard from "../_components/ui/ProductCard";

enum SortOption {
  NAME = "name",
  PRICE = "price",
  STOCK = "stock",
}
enum SortTypeOption {
  ASC = "Ascending",
  DESC = "Descending",
}
const sortOptions = [
  { value: SortOption.NAME, label: "Name" },
  { value: SortOption.PRICE, label: "Price" },
  { value: SortOption.STOCK, label: "Stock" },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchValue = useDebounce(searchTerm, 500);

  // ** Redux Hooks
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.product);

  const [products, setProducts] = useState<Product[]>(store.data);
  const [activeSort, setActiveSort] = useState<SortOption>(SortOption.NAME);
  const [activeSortType, setActiveSortType] = useState<SortTypeOption>(
    SortTypeOption.ASC
  );

  useEffect(() => {
    let newProducts = [...store.data];
    newProducts = newProducts.filter((item) => item.name.includes(searchValue));
    // ? sengaja tidak dibuat case sensitive biar mudah terlihat filternya
    newProducts = newProducts.sort((a, b) => {
      if (activeSort === SortOption.NAME) {
        if (activeSortType === SortTypeOption.ASC)
          return a.name < b.name ? -1 : 1;
        else return b.name < a.name ? -1 : 1;
      } else if (activeSort === SortOption.PRICE) {
        if (activeSortType === SortTypeOption.ASC) return a.price - b.price;
        else return b.price - a.price;
      } else if (activeSort === SortOption.STOCK) {
        if (activeSortType === SortTypeOption.ASC) return a.stock - b.stock;
        else return b.stock - a.stock;
      }

      return 1;
    });
    setProducts(newProducts);
  }, [searchValue, activeSort, activeSortType]);

  // async function fetchData() {
  //   fetch("https://dummyjson.com/products")
  //     .then((res) => res.json())
  //     .then((res) =>
  //       console.log(
  //         res.products.map((item: any) => ({
  //           id: item.id,
  //           name: item.title,
  //           price: item.price,
  //           stock: item.stock,
  //           thumbnail: item.thumbnail,
  //           createdAt: item.meta.createdAt,
  //           updatedAt: item.meta.updatedAt,
  //         }))
  //       )
  //     );
  // }
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <UserPageLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardHeader title="Sort" sx={{ pb: 0 }} />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                By
              </Typography>
              <List dense>
                {sortOptions.map((option) => (
                  <ListItemButton
                    key={`home-product-sort-option-${option.value}`}
                    selected={option.value === activeSort}
                    onClick={() => setActiveSort(option.value)}
                  >
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                ))}
              </List>
              <Divider />
              <List dense>
                <ListItemButton
                  selected={activeSortType === SortTypeOption.ASC}
                  onClick={() => setActiveSortType(SortTypeOption.ASC)}
                >
                  <ListItemText primary="Ascending" />
                </ListItemButton>
                <ListItemButton
                  selected={activeSortType === SortTypeOption.DESC}
                  onClick={() => setActiveSortType(SortTypeOption.DESC)}
                >
                  <ListItemText primary="Descending" />
                </ListItemButton>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack direction="row" gap={2} alignItems="center" mb={2}>
            <SearchIcon />
            <TextField
              name="search"
              fullWidth
              size="small"
              variant="standard"
              placeholder="Search Product"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>
          <Box>
            <Grid container spacing={2}>
              {products.map((product, index) => (
                <Grid key={`home-product-card-${index}`} item xs={12} md={4}>
                  <ProductCard product={product} relativeDate />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </UserPageLayout>
  );
}
