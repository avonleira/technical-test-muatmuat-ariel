"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { RootState, AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, setData } from "@/store/product";

import { MUIDataGridDefaults } from "@/utils/muiDefaults";
import { useDialog } from "@/hooks/useDialog";
import { PRODUCTS } from "@/mocks/products";
import UserPageLayout from "../_components/layout";

import AddProductDialog from "./_components/AddProductDialog";
import EditProductDialog from "./_components/EditProductDialog";

const baseColumns: GridColDef[] = [
  {
    flex: 1,
    minWidth: 160,
    type: "string",
    field: "name",
    headerName: "Name",
  },
  {
    flex: 1,
    minWidth: 160,
    type: "number",
    field: "price",
    headerName: "Price ($)",
  },
  {
    flex: 1,
    minWidth: 160,
    type: "number",
    field: "stock",
    headerName: "Stock",
  },
  {
    flex: 1,
    minWidth: 180,
    type: "dateTime",
    field: "createdAt",
    headerName: "Created At",
    valueGetter: (params: any) => (!!params ? new Date(params) : null),
  },
  {
    flex: 1,
    minWidth: 180,
    type: "dateTime",
    field: "updatedAt",
    headerName: "Updated At",
    valueGetter: (params: any) => (!!params ? new Date(params) : null),
  },
];

const editDefaultValues = { id: null, open: false };

export default function MasterProductsListPage() {
  const { pushConfirm } = useDialog();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchValue = useDebounce(searchTerm, 500);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<{
    id: number | null;
    open: boolean;
  }>(editDefaultValues);

  // ** Redux Hooks
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.product);

  function deleteData(id: number) {
    dispatch(deleteProduct(id));
  }

  useEffect(() => {
    let newProducts = [...PRODUCTS];
    newProducts = newProducts.filter((item) => item.name.includes(searchValue));
    dispatch(setData(newProducts));
  }, [searchValue]);

  const columns: GridColDef[] = [
    ...baseColumns,
    {
      width: 120,
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            color="warning"
            onClick={() => setEditValue({ id: params.row.id, open: true })}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="error"
            onClick={() =>
              pushConfirm({
                title: "Delete Category?",
                content: "Are you sure you want to delete?",
                onAgreeBtnClick: () => deleteData(params.row.id),
              })
            }
          />,
        ];
      },
    },
  ];

  return (
    <UserPageLayout appbarTitle="Master Product">
      <Stack
        direction="row"
        gap={2}
        justifyContent="end"
        alignItems="center"
        pb={2}
      >
        <TextField
          name="search"
          variant="outlined"
          size="small"
          placeholder={`Search on ${store.data.length} product(s)`}
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Product
        </Button>
      </Stack>
      <Alert severity="info" sx={{ mb: 2 }}>
        Using search fiture will reset all create, update, and delete actions
        performed!
      </Alert>
      <Box sx={{ maxWidth: "90vw" }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={store.data}
          loading={store.addLoading || store.editLoading || store.deleteLoading}
        />
      </Box>

      <AddProductDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
      <EditProductDialog
        id={editValue.id}
        open={editValue.open}
        onClose={() => setEditValue(editDefaultValues)}
      />
    </UserPageLayout>
  );
}
