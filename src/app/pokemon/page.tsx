"use client";

import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { MUIDataGridDefaults } from "@/utils/muiDefaults";
import UserPageLayout from "../_components/layout";

const baseColumns: GridColDef[] = [
  {
    flex: 1,
    minWidth: 160,
    type: "string",
    field: "name",
    headerName: "Name",
  },
];

const pokemonsDefaultValues = {
  data: [],
  total: 0,
  perPage: 20,
  page: 1,
  loading: false,
  error: false,
  success: false,
};

export default function PokemonPage() {
  const [pokemons, setPokemons] = useState(pokemonsDefaultValues);

  async function fetchPokemons() {
    setPokemons({ ...pokemons, loading: true, error: false, success: false });
    await fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => response.json())
      .then((response) => {
        console.log(response.results);
        setPokemons({
          ...pokemons,
          loading: false,
          success: true,
          total: response.count,
          data: response.results,
        });
      });
  }

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <UserPageLayout appbarTitle="Pokemon">
      <Box sx={{ maxWidth: "90vw" }}>
        <DataGrid
          {...MUIDataGridDefaults}
          getRowId={(row) => row.name}
          columns={baseColumns}
          rows={pokemons.data}
          loading={pokemons.loading}
        />
      </Box>
    </UserPageLayout>
  );
}
