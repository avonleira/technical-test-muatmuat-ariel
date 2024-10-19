"use client";

// ** Next & React Imports
import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  Fragment,
} from "react";

// ** MUI Component Imports
import {
  type ButtonProps,
  type Breakpoint,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent,
} from "@mui/material";

interface Props {
  open?: boolean;
  onClose?: () => void;
  maxWidth?: false | Breakpoint;
  fullWidth?: boolean;
  allowFullScreen?: boolean;
  title: string;
  content: string;
  agreeBtnText?: string;
  cancelBtnText?: string;
  onAgreeBtnClick?: () => void;
  onCancelBtnClick?: () => void;
  actionButtons?: ButtonProps[];
}

interface IDialogContext {
  setDialogProps: React.Dispatch<React.SetStateAction<Props>>;
  pushAlert: (props: Props) => void;
  pushConfirm: (props: Props) => void;
}

const DialogContext = createContext<IDialogContext>({} as IDialogContext);

const defaultDialogProps: Props = {
  open: false,
  title: "",
  content: "",
};

const DialogProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [dialogProps, setDialogProps] = useState<Props>(defaultDialogProps);

  const handleClose = () => {
    setDialogProps({ ...dialogProps, open: false });
  };

  const pushAlert = (alertProps: Props) => {
    setDialogProps({
      ...alertProps,
      open: true,
      onClose: () => {
        if (!!alertProps.onClose) {
          alertProps.onClose();
          handleClose();
        }
      },
      actionButtons: [
        {
          children: "OK",
          onClick: () => {
            if (!!alertProps.onAgreeBtnClick) alertProps.onAgreeBtnClick();
            if (!!alertProps.onClose) alertProps.onClose();
            handleClose();
          },
        },
      ],
    });
  };

  const pushConfirm = (confirmProps: Props) => {
    setDialogProps({
      ...confirmProps,
      open: true,
      onClose: () => {
        if (!!confirmProps.onClose) {
          confirmProps.onClose();
          handleClose();
        }
      },
      actionButtons: confirmProps?.actionButtons
        ? confirmProps?.actionButtons?.map((btnProps) => ({
            ...btnProps,
            onClick: () => {
              if (!!btnProps.onClick)
                btnProps.onClick(
                  {} as React.MouseEvent<HTMLButtonElement, MouseEvent>
                );
              handleClose();
            },
          }))
        : undefined,
      onAgreeBtnClick: () => {
        if (!!confirmProps.onAgreeBtnClick) confirmProps.onAgreeBtnClick();
        handleClose();
      },
      onCancelBtnClick: () => {
        if (!!confirmProps.onCancelBtnClick) confirmProps.onCancelBtnClick();
        handleClose();
      },
    });
  };

  const value = {
    setDialogProps,
    pushAlert,
    pushConfirm,
  };

  return (
    <DialogContext.Provider value={value} {...props}>
      {dialogProps.open ? (
        <MyConfirmDialog
          {...dialogProps}
          open={dialogProps.open ?? false}
          onClose={handleClose}
        />
      ) : null}
      {children}
    </DialogContext.Provider>
  );
};

interface IMyConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  maxWidth?: false | Breakpoint;
  fullWidth?: boolean;
  allowFullScreen?: boolean;
  title?: string;
  content?: string;
  agreeBtnText?: string;
  cancelBtnText?: string;
  onAgreeBtnClick?: () => void;
  onCancelBtnClick?: () => void;
  actionButtons?: ButtonProps[];
}

function MyConfirmDialog(props: IMyConfirmDialogProps) {
  const {
    open,
    onClose,
    fullWidth = true,
    maxWidth = "xs",
    allowFullScreen,
  } = props;
  const { title = "Title", content = "Contents..." } = props;
  const {
    agreeBtnText = "OK",
    cancelBtnText = "CANCEL",
    actionButtons,
  } = props;
  const { onAgreeBtnClick, onCancelBtnClick = onClose } = props;
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      fullScreen={allowFullScreen ? !upMd : false}
      keepMounted={false}
      onClose={onClose}
      aria-describedby="my-confirm-dialog"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: "pre-wrap" }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!!actionButtons && actionButtons.length ? (
          <Fragment>
            {actionButtons?.map((btnProps, index) => (
              <Button
                key={`my-confirm-dialog-action-button-item-${index}`}
                {...btnProps}
              />
            ))}
          </Fragment>
        ) : (
          <Fragment>
            <Button color="error" onClick={onCancelBtnClick}>
              {cancelBtnText}
            </Button>
            <Button onClick={onAgreeBtnClick} autoFocus>
              {agreeBtnText}
            </Button>
          </Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
}

const useDialog = () => useContext(DialogContext);

export { DialogProvider, useDialog };
