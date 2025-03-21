import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";

import headerLgo from "../images/Logo.svg";
import avatarPic from "../images/avatar.jpg";
import pencilPic from "../images/Pencil.svg";
import plusPic from "../images/Plus.svg";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },

//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },

//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "85169225-e5f4-403d-9b20-158537f7fe7d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardList.append(cardEl);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    avatarInput.src = userInfo.avatar;
  })
  .catch(console.error);

//Profile Elements
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileNameEl = document.querySelector(".profile__name");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileDescriptionEl = document.querySelector(".profile__description");

//Form Elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

//Modal Element
const modals = document.querySelectorAll(".modal");

let selectedCard, selectedCardId;

//Card form elements
const cardModal = document.querySelector("#card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const linkInput = cardModal.querySelector("#card-link-input");
const captionInput = cardModal.querySelector("#card-caption-input");

//Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-button");

//Avatar modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Select Modal
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewModalClosebtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

//card Elements
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

//imported Images
const headerImg = document.getElementById("header-logo");
headerImg.src = headerLgo;
const avatarImg = document.getElementById("avatar-img");
avatarImg.src = avatarPic;
const pencilImg = document.getElementById("pencil-icon");
pencilImg.src = pencilPic;
const plusIcon = document.getElementById("plus-icon");
plusIcon.src = plusPic;

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");

  document.addEventListener("keyup", handleKeydown);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");

  document.removeEventListener("keyup", handleKeydown);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  console.log(submitBtn);

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  console.log(submitBtn);

  const name = captionInput.value;
  const link = linkInput.value;

  api
    .addCard({ name, link })
    .then((res) => {
      const cardEl = getCardElement(res);
      cardList.prepend(cardEl);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch((err) => console.error("Failed to add card:", err))
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  console.log(submitBtn);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleDeleteCard(cardElement, cardId) {
  if (!cardId) {
    console.error("Card ID is missing!");
    return;
  }
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleImageClick(data) {
  previewImage.src = data.link;
  previewCaption.textContent = data.name;
  previewImage.alt = data.name;
  openModal(previewModal);
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;

  const isLiked = likeButton.classList.contains("card__like-btn-liked");

  api
    .addLikeStatues(cardId, isLiked)
    .then((data) => {
      if (isLiked) {
        likeButton.classList.remove("card__like-btn-liked");
      } else {
        likeButton.classList.add("card__like-btn-liked");
      }
    })
    .catch((err) => console.error("Error while updating like status:", err));
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  if (data.likes && data.likes.some((like) => like._id === userInfo._id)) {
    likeButton.classList.add("card__like-btn-liked");
  }

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  likeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

editModalBtn.addEventListener("click", () => {
  nameInput.value = profileNameEl.textContent;
  descriptionInput.value = profileDescriptionEl.textContent;
  openModal(editModal);
});

editForm.addEventListener("submit", handleEditProfileSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardForm.addEventListener("submit", handleCardSubmit);

document.addEventListener("keyup", handleEscape);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal") ||
      evt.target.classList.contains("modal__close")
    ) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
