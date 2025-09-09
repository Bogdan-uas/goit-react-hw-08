import React, { useId, useRef, useEffect, useState, KeyboardEvent } from "react";
import style from "./ContactForm.module.css";
import css from "../Contact/Contact.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { ToastOptions } from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { addContact, deleteAllContacts } from "../../redux/contacts/operations";
import { openModal, closeModal } from "../../redux/ui/modalSlice";

import type { Contact } from "../../redux/contacts/types";
import type { AppDispatch } from '../../redux/store'; 
import { useTranslation } from "react-i18next";
import { useNotify } from "../../helpers/useNotify";

interface FormValues {
  name: string;
  number: string;
}

const initialValues: FormValues = { name: "", number: "" };

export default function ContactForm(): React.ReactElement {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const notify = useNotify();

  const contacts = useSelector(selectContacts);
  const isModalOpen = useSelector(selectIsModalOpen);
  const isEditingGlobal = useSelector(selectIsEditingGlobal);
  const isLocked = isModalOpen || isEditingGlobal;

  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const deleteAllButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const nameFieldId = useId();
  const numberFieldId = useId();

  const toastOptions: ToastOptions = {
    duration: 4000,
    style: { borderRadius: "10px", textAlign: "center" },
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

  const normalizeNumber = (num: string) => parsePhoneNumberFromString(num)?.number || num;

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (isLocked) {
      notify.error(
        isModalOpen
          ? t("contactsPage.form.toast.closeModalFirst")
          : t("contactsPage.form.toast.cantAddWhileEditing"),
        toastOptions
      );
      return;
    }

    const inputName = values.name.trim().toLowerCase();
    const inputNumber = normalizeNumber(values.number);

    const isExactDuplicate = contacts.some(
      (c: Contact) =>
        c.name.trim().toLowerCase() === inputName &&
        normalizeNumber(c.number) === inputNumber
    );

    const isNumberDuplicate = contacts.some(
      (c: Contact) => normalizeNumber(c.number) === inputNumber
    );

    if (isExactDuplicate) {
      notify.error(t("contactsPage.form.toast.duplicateExact"), { ...toastOptions, duration: 5000 });
      actions.resetForm();
      return;
    }

    dispatch(addContact(values))
      .unwrap()
      .then(() => {
        if (isNumberDuplicate) {
          notify.normal(t("contactsPage.form.toast.duplicateNumberWarning"), {
            icon: '❗',
            ...toastOptions,
            duration: 8000
          });
        } else {
          notify.success(t("contactsPage.form.toast.successAdd"), toastOptions);
        }
        actions.resetForm();
      })
      .catch(() => notify.error(t("contactsPage.form.toast.failedAdd"), toastOptions));
  };

  const cancelDeleteAll = () => {
    dispatch(closeModal());
    setShowDeleteAllModal(false);
    deleteAllButtonRef.current?.focus();
  };

  const confirmDeleteAll = () => {
    dispatch(deleteAllContacts())
      .unwrap()
      .then(() => {
        notify.success(t("contactsPage.form.toast.allDeleted"), toastOptions);
        cancelDeleteAll();
      })
      .catch(() => notify.error(t("contactsPage.form.toast.failedDeleteAll"), toastOptions));
  };

  useEffect(() => {
    if (!showDeleteAllModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelDeleteAll();
      else if (e.key === "Enter") confirmDeleteAll();
    };

    window.addEventListener("keydown", handleKeyDown as any);
    return () => window.removeEventListener("keydown", handleKeyDown as any);
  }, [showDeleteAllModal]);

  return (
    <div className={style.main_container}>
      <Formik initialValues={initialValues} validationSchema={FeedbackSchema} onSubmit={handleSubmit}>
        {({ handleSubmit }) => (
          <Form className={style.form} onSubmit={handleSubmit}>
            {["name", "number"].map((field, i) => {
              const id = field === "name" ? nameFieldId : numberFieldId;
              const label = field === "name" ? t("contactsPage.form.nameLabel") : t("contactsPage.form.numberLabel");
              return (
                <div key={i} className={style.name_number_container}>
                  <label htmlFor={id} className={style.label}>{label}</label>
                  <Field type="text" name={field} id={id} className={style.input} />
                  <ErrorMessage className={style.error_message} name={field} component="span" />
                </div>
              );
            })}
            <button
              type="submit"
              className={`${style.button} ${isLocked ? style.disabled : ""}`}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  notify.error(
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

      {contacts.length > 0 && (
        <button
          ref={deleteAllButtonRef}
          type="button"
          className={`${css.delete_button} ${style.delete_button} ${isLocked ? style.disabled : ""}`}
          onClick={() => {
            if (isLocked) {
              notify.error(
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
        <div role="dialog" aria-modal="true" aria-labelledby="deleteAllTitle" tabIndex={-1} ref={modalRef} className={css.confirm_modal}>
          <p id="deleteAllTitle" className={css.info_text}>
            {t("contactsPage.form.deleteAllModal.confirmText1")} <b>{t("contactsPage.form.deleteAllModal.all")}</b> {t("contactsPage.form.deleteAllModal.confirmText2")}
          </p>
          <span className={css.info_text}>{t("contactsPage.form.deleteAllModal.warningText")}</span>
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