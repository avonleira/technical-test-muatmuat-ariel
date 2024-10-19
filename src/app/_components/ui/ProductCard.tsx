"use client";

// import Link from "next/link";

import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";

import { formatDayMonth } from "@/utils/dayjsConst";
import { intlNumberFormat } from "@/utils/intlNumberFormat";
import { Product } from "@/types/product";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  product: Product;
  relativeDate?: boolean;
  equalHeight?: boolean;
}
export default function ProductCard({
  product,
  relativeDate = false,
  equalHeight = false,
}: Props) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  if (!!product)
    return (
      <Card elevation={3} sx={{ height: equalHeight ? "100%" : undefined }}>
        <CardActionArea
          // LinkComponent={Link}
          // href={`/contents/${product.id}`}
          sx={{ height: equalHeight ? "100%" : undefined }}
        >
          <CardMedia
            component="img"
            loading="lazy"
            src={product.thumbnail}
            height={upMd ? 200 : 120}
          />
          <CardHeader
            title={product.name}
            subheader={
              relativeDate
                ? dayjs(product.createdAt).fromNow()
                : dayjs(product.createdAt).format(formatDayMonth)
            }
            titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            subheaderTypographyProps={{ variant: "caption" }}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h5" textAlign="justify">
              $ {intlNumberFormat(product.price, true)}
            </Typography>
            <Stack direction="row" alignItems="center" gap={2} mt={2}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ color: product.stock <= 5 ? "error.main" : undefined }}
              >
                <InventoryIcon fontSize="small" />
                <Typography variant="caption">
                  {intlNumberFormat(product.stock, true)}
                </Typography>
              </Stack>
              {/* <Stack direction='row' alignItems='center' gap={1}>
                <FavoriteIcon fontSize='11' />
                <Typography variant='caption'>{intlNumberFormat(product.likeCounter, true)}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' gap={1}>
                <ShareIcon fontSize='11' />
                <Typography variant='caption'>{intlNumberFormat(product.shareCounter, true)}</Typography>
              </Stack> */}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );

  return null;
}
