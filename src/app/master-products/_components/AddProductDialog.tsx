"use client";

import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/product";
import { Product } from "@/types/product";

const formId = "product-add-form";

interface Props {
  open: boolean;
  onClose: () => void;
}
export default function AddProductDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  // ** Redux Hooks
  const dispatch = useDispatch<AppDispatch>();

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      name: "",
      price: 0,
      stock: 1,
      thumbnail: "",
    },
    mode: "onChange",
  });

  function handleClose() {
    formHook.reset();
    onClose();
  }

  function onSubmit(data: Partial<Product>) {
    dispatch(addProduct(data));
    handleClose();
  }

  return (
    <Dialog maxWidth="xs" fullWidth fullScreen={!upMd} open={open}>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Add New Product</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id={formId}
          onSubmit={formHook.handleSubmit(onSubmit)}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            InputLabelProps={{ shrink: true }}
            placeholder="Type product name"
            {...formHook.register("name", {
              required: "Name is required!",
            })}
            error={Boolean(formHook.formState.errors.name)}
            helperText={
              Boolean(formHook.formState.errors.name)
                ? formHook.formState.errors.name?.message
                : undefined
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: "any" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
            placeholder="Type product price"
            {...formHook.register("price", {
              required: "Price is required!",
              min: { value: 0.1, message: "Min value is 0.1!" },
            })}
            error={Boolean(formHook.formState.errors.price)}
            helperText={
              Boolean(formHook.formState.errors.price)
                ? formHook.formState.errors.price?.message
                : undefined
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            type="number"
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">pcs</InputAdornment>
                ),
              },
            }}
            placeholder="Type product stock"
            {...formHook.register("stock", {
              required: "Stock is required!",
              min: { value: 1, message: "Min value is 1!" },
            })}
            error={Boolean(formHook.formState.errors.stock)}
            helperText={
              Boolean(formHook.formState.errors.stock)
                ? formHook.formState.errors.stock?.message
                : undefined
            }
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            margin="normal"
            label="Thumbnail URL"
            InputLabelProps={{ shrink: true }}
            placeholder="Enter thumbnail URL (optional)"
            {...formHook.register("thumbnail")}
            error={Boolean(formHook.formState.errors.thumbnail)}
            helperText={
              Boolean(formHook.formState.errors.thumbnail)
                ? formHook.formState.errors.thumbnail?.message
                : undefined
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button form={formId} type="submit" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}