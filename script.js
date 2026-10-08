// ===== WHATSAPP НОМЕРЛЕРИ =====

const WHATSAPP_NUMBERS = [
    "996504111171",
    "996774064252"
];


// ===== МЕНЮ =====

const MENU = [
    {
        id: 1,
        name: "Мисал: Филадельфия",
        category: "Роллдор",
        price: 350,
        emoji: "🍣",
        image: "images/philadelphia.jpg",
        desc: "Даамдуу Филадельфия роллу"
    },

    {
        id: 2,
        name: "Мисал: Канат",
        category: "Закускалар",
        price: 350,
        emoji: "🍗",
        desc: "Кытырак тоок канаттары"
    },

    {
        id: 3,
        name: "Мисал: Шашлык",
        category: "Шашлык",
        price: 250,
        emoji: "🍢",
        desc: "Даамдуу шашлык"
    },

    {
        id: 4,
        name: "Мисал: Лимонад",
        category: "Суусундуктар",
        price: 250,
        emoji: "🥤",
        desc: "Муздак лимонад"
    }
];


let cart = [];
let currentCategory = "Баары";


// ===== БААНЫ ФОРМАТТОО =====

function money(number) {
    return new Intl.NumberFormat("ky-KG").format(number) + " сом";
}


// ===== КАТЕГОРИЯЛАР =====

function categories() {

    const cats = [
        "Баары",
        ...new Set(MENU.map(item => item.category))
    ];

    document.getElementById("categories").innerHTML =
        cats.map(category => {

            return `
                <button
                    class="cat ${category === currentCategory ? "active" : ""}"
                    onclick="setCategory('${category.replaceAll("'", "\\'")}')"
                >
                    ${category}
                </button>
            `;

        }).join("");
}


function setCategory(category) {

    currentCategory = category;

    categories();

    render();
}


// ===== ТОВАРЛАРДЫ КӨРСӨТҮҮ =====

function render() {

    const list =
        currentCategory === "Баары"
            ? MENU
            : MENU.filter(item => item.category === currentCategory);


    const products = document.getElementById("products");


    if (!list.length) {

        products.innerHTML = `
            <div class="empty">
                Бул категорияда азырынча тамак жок.
            </div>
        `;

        return;
    }


    products.innerHTML = list.map(item => {

        return `
            <article class="card">

                <div class="photo">

                    ${
                        item.image
                            ? `<img
                                src="${item.image}"
                                alt="${item.name}"
                                loading="lazy"
                              >`
                            : item.emoji || "🍽️"
                    }

                </div>


                <div class="card-body">

                    <h3>
                        ${item.name}
                    </h3>


                    <div class="desc">
                        ${item.desc || ""}
                    </div>


                    <div class="row">

                        <span class="price">
                            ${money(item.price)}
                        </span>


                        <button
                            class="add"
                            onclick="add(${item.id})"
                        >
                            Кошуу
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");


    updateCount();
}


// ===== СЕБЕТКЕ КОШУУ =====

function add(id) {

    const product =
        MENU.find(item => item.id === id);

    const old =
        cart.find(item => item.id === id);


    if (old) {

        old.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }


    updateCount();

    openCart();
}


// ===== СЕБЕТ САНЫ =====

function updateCount() {

    const count =
        cart.reduce(
            (sum, item) => sum + item.qty,
            0
        );


    document.getElementById("cartCount").textContent = count;
}


// ===== CART АЧУУ =====

function openCart() {

    document
        .getElementById("cartModal")
        .classList.add("open");


    renderCart();
}


// ===== CART ЖАБУУ =====

function closeCart() {

    document
        .getElementById("cartModal")
        .classList.remove("open");
}


// ===== САНЫН ӨЗГӨРТҮҮ =====

function change(id, amount) {

    const item =
        cart.find(product => product.id === id);


    if (!item) {
        return;
    }


    item.qty += amount;


    if (item.qty <= 0) {

        cart =
            cart.filter(
                product => product.id !== id
            );

    }


    renderCart();

    updateCount();
}


// ===== CART КӨРСӨТҮҮ =====

function renderCart() {

    const box =
        document.getElementById("cartItems");


    if (!cart.length) {

        box.innerHTML = `
            <div class="empty">
                Себетиңиз бош.
            </div>
        `;

    } else {

        box.innerHTML = cart.map(item => {

            return `
                <div class="cart-item">

                    <div>

                        <b>
                            ${item.name}
                        </b>

                        <div class="price">
                            ${money(item.price * item.qty)}
                        </div>

                    </div>


                    <div class="qty">

                        <button
                            onclick="change(${item.id}, -1)"
                        >
                            −
                        </button>


                        <b>
                            ${item.qty}
                        </b>


                        <button
                            onclick="change(${item.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>
            `;

        }).join("");

    }


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.qty,
            0
        );


    document.getElementById("total").textContent =
        money(total);
}


// ===== WHATSAPP =====

function sendWhatsApp() {

    if (!cart.length) {

        alert(
            "Алгач тамак тандаңыз."
        );

        return;
    }


    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const address =
        document
            .getElementById("address")
            .value
            .trim();


    const comment =
        document
            .getElementById("comment")
            .value
            .trim();


    let message =
        "Салам! ОКЕАН КАФЕден буйрутма бергим келет.\n\n";


    cart.forEach(item => {

        message +=
            `• ${item.name} — ${item.qty} даана — ${item.price * item.qty} сом\n`;

    });


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.qty,
            0
        );


    message +=
        `\nЖалпы: ${total} сом\n`;


    message +=
        `Аты: ${name || "көрсөтүлгөн жок"}\n`;


    message +=
        `Телефон: ${phone || "көрсөтүлгөн жок"}\n`;


    message +=
        `Дарек: ${address || "көрсөтүлгөн жок"}\n`;


    message +=
        `Комментарий: ${comment || "жок"}`;


    const encoded =
        encodeURIComponent(message);


    const number =
        WHATSAPP_NUMBERS[0];


    const url =
        "https://wa.me/" +
        number +
        "?text=" +
        encoded;


    window.location.href = url;
}


// ========================================
// ADMIN
// ========================================

const ADMIN_PASSWORD = "bobur222";


// ===== ADMIN АЧУУ =====

function openAdmin() {

    document
        .getElementById("adminModal")
        .classList.add("open");
}


// ===== ADMIN ЖАБУУ =====

function closeAdmin() {

    document
        .getElementById("adminModal")
        .classList.remove("open");
}


// ===== ADMIN LOGIN =====

function adminLogin() {

    const password =
        document
            .getElementById("adminPassword")
            .value;


    if (password !== ADMIN_PASSWORD) {

        alert(
            "Сырсөз туура эмес."
        );

        return;
    }


    document
        .getElementById("adminLogin")
        .style.display = "none";


    document
        .getElementById("adminPanel")
        .style.display = "block";


    renderAdmin();
}


// ===== MENU САКТОО =====

function saveMenu() {

    localStorage.setItem(
        "okean_menu",
        JSON.stringify(MENU)
    );
}


// ===== MENU ЖҮКТӨӨ =====

function loadMenu() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "okean_menu"
                )
            );


        if (
            Array.isArray(saved) &&
            saved.length
        ) {

            MENU.splice(
                0,
                MENU.length,
                ...saved
            );

        }

    } catch (error) {

        console.log(
            "Menu load error:",
            error
        );

    }
}


// ===== ЖАҢЫ СҮРӨТ =====

let newImageData = "";


function previewNewImage(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    if (file.size > 1500000) {

        alert(
            "Сүрөт 1.5 MBдан кичине болсун."
        );


        event.target.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function () {

        newImageData =
            reader.result;


        const preview =
            document.getElementById(
                "newImagePreview"
            );


        preview.src =
            newImageData;


        preview.style.display =
            "block";
    };


    reader.readAsDataURL(file);
}


// ===== ЖАҢЫ ТАМАК КОШУУ =====

function addMenuItem() {

    const name =
        document
            .getElementById("newName")
            .value
            .trim();


    const category =
        document
            .getElementById("newCategory")
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById("newPrice")
                .value
        );


    const emoji =
        document
            .getElementById("newEmoji")
            .value
            .trim() || "🍽️";


    const desc =
        document
            .getElementById("newDesc")
            .value
            .trim();


    if (
        !name ||
        !category ||
        !price
    ) {

        alert(
            "Аталышын, категориясын жана баасын толтуруңуз."
        );

        return;
    }


    MENU.push({

        id: Date.now(),

        name: name,

        category: category,

        price: price,

        emoji: emoji,

        desc: desc,

        image: newImageData

    });


    saveMenu();

    categories();

    render();

    renderAdmin();


    document
        .getElementById("newName")
        .value = "";


    document
        .getElementById("newCategory")
        .value = "";


    document
        .getElementById("newPrice")
        .value = "";


    document
        .getElementById("newEmoji")
        .value = "";


    document
        .getElementById("newDesc")
        .value = "";


    document
        .getElementById("newImage")
        .value = "";


    document
        .getElementById("newImagePreview")
        .style.display = "none";


    newImageData = "";
}


// ===== ТАМАК ӨЧҮРҮҮ =====

function deleteMenuItem(id) {

    if (
        !confirm(
            "Бул тамакты өчүрөсүзбү?"
        )
    ) {
        return;
    }


    const index =
        MENU.findIndex(
            item => item.id === id
        );


    if (index >= 0) {

        MENU.splice(
            index,
            1
        );

    }


    saveMenu();

    categories();

    render();

    renderAdmin();
}


// ===== ТАМАКТЫ ӨЗГӨРТҮҮ =====

function editMenuItem(id) {

    const item =
        MENU.find(
            product => product.id === id
        );


    if (!item) {
        return;
    }


    const name =
        prompt(
            "Тамактын аты:",
            item.name
        );


    if (name === null) {
        return;
    }


    const price =
        prompt(
            "Баасы (сом):",
            item.price
        );


    if (price === null) {
        return;
    }


    const category =
        prompt(
            "Категориясы:",
            item.category
        );


    if (category === null) {
        return;
    }


    item.name =
        name.trim() || item.name;


    item.price =
        Number(price) || item.price;


    item.category =
        category.trim() || item.category;


    saveMenu();

    categories();

    render();

    renderAdmin();
}


// ===== СҮРӨТТҮ ӨЗГӨРТҮҮ =====

function changeMenuImage(id) {

    const item =
        MENU.find(
            product => product.id === id
        );


    if (!item) {
        return;
    }


    const input =
        document.createElement("input");


    input.type = "file";

    input.accept = "image/*";


    input.onchange = function (event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (file.size > 1500000) {

            alert(
                "Сүрөт 1.5 MBдан кичине болсун."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function () {

            item.image =
                reader.result;


            saveMenu();

            render();

            renderAdmin();
        };


        reader.readAsDataURL(file);
    };


    input.click();
}


// ===== ADMIN MENU =====

function renderAdmin() {

    const list =
        document.getElementById(
            "adminList"
        );


    list.innerHTML =
        MENU.map(item => {

            return `
                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:8px;
                        align-items:center;
                        padding:10px 0;
                        border-bottom:1px solid var(--line);
                    "
                >

                    <div
                        style="
                            display:flex;
                            gap:10px;
                            align-items:center;
                        "
                    >

                        <div>

                            ${
                                item.image

                                    ? `<img
                                        class="admin-image-preview"
                                        src="${item.image}"
                                        alt="${item.name}"
                                      >`

                                    : item.emoji || "🍽️"
                            }

                        </div>


                        <div>

                            <b>
                                ${item.name}
                            </b>

                            <div class="note">
                                ${item.category}
                                •
                                ${money(item.price)}
                            </div>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:5px;
                            flex-wrap:wrap;
                            justify-content:flex-end;
                        "
                    >

                        <button
                            class="add"
                            onclick="changeMenuImage(${item.id})"
                        >
                            📷 Сүрөт
                        </button>


                        <button
                            class="add"
                            onclick="editMenuItem(${item.id})"
                        >
                            Өзгөртүү
                        </button>


                        <button
                            class="add"
                            onclick="deleteMenuItem(${item.id})"
                        >
                            Өчүрүү
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// ===== САЙТТЫ ИШТЕТҮҮ =====

loadMenu();

categories();

render();