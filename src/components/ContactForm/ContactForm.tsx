import React, { useId, useRef, useEffect, useState, KeyboardEvent } from "react";
import style from "./ContactForm.module.css";
import css from "../Contact/Contact.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import toast from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";

import { addContact, deleteAllContacts } from "../../redux/contacts/operations";
import { openModal, closeModal } from "../../redux/ui/modalSlice";

import type { Contact } from "../../redux/contacts/types";
import type { AppDispatch } from '../../redux/store'; 

import { useTranslation } from "react-i18next";

interface FormValues {
  name: string;
  number: string;
}

const initialValues: FormValues = {
  name: "",
  number: "",
};

export default function ContactForm(): React.ReactElement {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  const isModalOpen = useSelector(selectIsModalOpen);
  const isEditingGlobal = useSelector(selectIsEditingGlobal);
  const isLocked = isModalOpen || isEditingGlobal;

  const contacts = useSelector(selectContacts);
  const hasContacts = contacts.length > 0;

  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const deleteAllButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const nameFieldId = useId();
  const numberFieldId = useId();

  const toastOptions = {
    duration: 4000,
    style: {
      borderRadius: "10px",
      textAlign: "center" as "center",
    },
  };

  const FeedbackSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("contactsPage.form.validation.nameTooShort"))
      .max(50, t("contactsPage.form.validation.nameTooLong"))
      .required(t("contactsPage.form.validation.required")),
    number: Yup.string()
      .min(9, t("contactsPage.form.validation.invalidNumber"))
      .required(t("contactsPage.form.validation.required")),
  });

  const normalizeIntlNumber = (number: string): string => {
    const parsed = parsePhoneNumberFromString(number);
    return parsed ? parsed.number : number;
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (isLocked) {
      toast.error(
        isModalOpen
          ? t("contactsPage.form.toast.closeModalFirst")
          : t("contactsPage.form.toast.cantAddWhileEditing"),
        toastOptions
      );
      return;
    }

    const inputName = values.name.trim().toLowerCase();
    const inputNumber = normalizeIntlNumber(values.number);

    const isExactDuplicate = contacts.some(
      (contact: Contact) =>
        contact.name.trim().toLowerCase() === inputName &&
        normalizeIntlNumber(contact.number) === inputNumber
    );

    const isNumberDuplicate = contacts.some(
      (contact: Contact) => normalizeIntlNumber(contact.number) === inputNumber
    );

    if (isExactDuplicate) {
      toast.error(t("contactsPage.form.toast.duplicateExact"), {
        ...toastOptions,
        duration: 5000,
      });
      actions.resetForm();
      return;
    }

    dispatch(addContact(values))
      .unwrap()
      .then(() => {
        if (isNumberDuplicate) {
          toast(t("contactsPage.form.toast.duplicateNumberWarning"), {
            icon: "❗",
            duration: 8000,
            style: {
              borderRadius: "10px",
              textAlign: "center" as "center",
            },
          });
        } else {
          toast.success(t("contactsPage.form.toast.successAdd"), toastOptions);
        }
        actions.resetForm();
      })
      .catch(() => {
        toast.error(t("contactsPage.form.toast.failedAdd"), toastOptions);
      });
  };

  const cancelDeleteAll = () => {
    dispatch(closeModal());
    setShowDeleteAllModal(false);
    if (deleteAllButtonRef.current) {
      deleteAllButtonRef.current.focus();
    }
  };

  const confirmDeleteAll = () => {
    dispatch(deleteAllContacts())
      .unwrap()
      .then(() => {
        toast.success(t("contactsPage.form.toast.allDeleted"), toastOptions);
        dispatch(closeModal());
        setShowDeleteAllModal(false);
      })
      .catch(() => {
        toast.error(t("contactsPage.form.toast.failedDeleteAll"), toastOptions);
      });
  };

  useEffect(() => {
    if (!showDeleteAllModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelDeleteAll();
      } else if (e.key === "Enter") {
        e.preventDefault();
        confirmDeleteAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown as any);
    return () => window.removeEventListener("keydown", handleKeyDown as any);
  }, [showDeleteAllModal]);

  return (
    <div className={style.main_container}>
      <Formik
        initialValues={initialValues}
        validationSchema={FeedbackSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form className={style.form} onSubmit={handleSubmit}>
            <div className={style.name_number_container}>
              <label htmlFor={nameFieldId} className={style.label}>
                {t("contactsPage.form.nameLabel")}
              </label>
              <Field
                type="text"
                name="name"
                id={nameFieldId}
                className={style.input}
              />
              <ErrorMessage
                className={style.error_message}
                name="name"
                component="span"
              />
            </div>
            <div className={style.name_number_container}>
              <label htmlFor={numberFieldId} className={style.label}>
                {t("contactsPage.form.numberLabel")}
              </label>
              <Field
                type="text"
                name="number"
                id={numberFieldId}
                className={style.input}
              />
              <ErrorMessage
                className={style.error_message}
                name="number"
                component="span"
              />
            </div>
            <button
              type="submit"
              className={`${style.button} ${isLocked ? style.disabled : ""}`}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  toast.error(
                    isModalOpen
                      ? t("contactsPage.form.toast.closeModalBeforeAdding")
                      : t("contactsPage.form.toast.cantAddWhileEditing"),
                    toastOptions
                  );
                }
              }}
            >
              {t("contactsPage.form.addButton")}
            </button>
          </Form>
        )}
      </Formik>

      {hasContacts && (
        <button
          ref={deleteAllButtonRef}
          type="button"
          className={`${css.delete_button} ${style.delete_button} ${
            isLocked ? style.disabled : ""
          }`}
          onClick={() => {
            if (isLocked) {
              toast.error(
                isModalOpen
                  ? t("contactsPage.form.toast.closeModalBeforeDeleting")
                  : t("contactsPage.form.toast.cantDeleteWhileEditing"),
                toastOptions
              );
            } else {
              dispatch(openModal());
              setShowDeleteAllModal(true);
            }
          }}
        >
          {t("contactsPage.form.deleteAllButton")}
        </button>
      )}

      {showDeleteAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteAllTitle"
          tabIndex={-1}
          ref={modalRef}
          className={css.confirm_modal}
        >
          <p id="deleteAllTitle" className={css.info_text}>
            {t("contactsPage.form.deleteAllModal.confirmText1")}
            {" "}<b>{t("contactsPage.form.deleteAllModal.all")}</b>{" "}
            {t("contactsPage.form.deleteAllModal.confirmText2")}
          </p>
          <span className={css.info_text}>
            {t("contactsPage.form.deleteAllModal.warningText")}
          </span>
          <div className={css.deletion_confirmation_button_group}>
            <button className={css.save_button} onClick={cancelDeleteAll}>
              {t("contactsPage.form.deleteAllModal.cancelButton")}
            </button>
            <button className={css.cancel_button} onClick={confirmDeleteAll}>
              {t("contactsPage.form.deleteAllModal.confirmButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
