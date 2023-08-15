function toggleLike(button) {
    const icon = button.querySelector("i");
    if (icon.classList.contains("bx-heart")) {
        icon.classList.remove("bx-heart");
        icon.classList.add("bxs-heart");
    } else {
        icon.classList.remove("bxs-heart");
        icon.classList.add("bx-heart");
    }
}

function toggleFavorite(button) {
    const icon = button.querySelector("i");
    if (icon.classList.contains("bx-star")) {
        icon.classList.remove("bx-star");
        icon.classList.add("bxs-star");
    } else {
        icon.classList.remove("bxs-star");
        icon.classList.add("bx-star");
    }
}