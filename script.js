const API_URL =
"https://script.google.com/macros/s/AKfycbxKHr9DbAFj48liTProinNJy30O6p3ltmIrozMZPB9qTXo7aaK4BSAnMmOoYoriS4OB/exec";


/* =====================================
   OPEN INVITATION
===================================== */

const opening =
document.getElementById("opening");

const openButton =
document.getElementById("openInvitation");

const mainContent =
document.getElementById("mainContent");

const music =
document.getElementById("bgMusic");


if (openButton) {

  openButton.addEventListener(
    "click",
    function() {

      document.body.classList.remove(
        "locked"
      );

      mainContent.classList.add(
        "show"
      );

      opening.classList.add(
        "hide"
      );


      if (music) {

        music.play().catch(
          function(error) {

            console.log(
              "Musik tidak dapat diputar:",
              error
            );

          }
        );

      }


      setTimeout(
        function() {

          opening.style.display =
            "none";

        },
        800
      );

    }
  );

}


/* =====================================
   COUNTDOWN
===================================== */

const weddingDate =
new Date(
  "2026-08-27T14:00:00+07:00"
);


function updateCountdown() {

  const now =
    new Date();


  let difference =
    Math.max(
      0,
      weddingDate - now
    );


  const days =
    Math.floor(
      difference / 86400000
    );


  difference %=
    86400000;


  const hours =
    Math.floor(
      difference / 3600000
    );


  difference %=
    3600000;


  const minutes =
    Math.floor(
      difference / 60000
    );


  difference %=
    60000;


  const seconds =
    Math.floor(
      difference / 1000
    );


  document.getElementById(
    "days"
  ).textContent =
    days;


  document.getElementById(
    "hours"
  ).textContent =
    hours;


  document.getElementById(
    "minutes"
  ).textContent =
    minutes;


  document.getElementById(
    "seconds"
  ).textContent =
    seconds;

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/* =====================================
   ATTENDANCE
===================================== */

let selectedAttendance =
"";


const attendanceButtons =
document.querySelectorAll(
  "[data-attendance]"
);


attendanceButtons.forEach(
  function(button) {

    button.addEventListener(
      "click",
      function() {

        attendanceButtons.forEach(
          function(btn) {

            btn.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        selectedAttendance =
          button.dataset.attendance;

      }
    );

  }
);


/* =====================================
   RSVP SUBMIT
===================================== */

const form =
document.getElementById(
  "rsvpForm"
);


if (form) {

  form.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const name =
        document.getElementById(
          "name"
        ).value.trim();


      const message =
        document.getElementById(
          "message"
        ).value.trim();


      const pax =
        document.getElementById(
          "pax"
        ).value;


      const success =
        document.getElementById(
          "success"
        );


      const error =
        document.getElementById(
          "error"
        );


      const submitButton =
        document.getElementById(
          "submitButton"
        );


      success.style.display =
        "none";


      error.style.display =
        "none";


      if (!name) {

        alert(
          "Silakan masukkan nama."
        );

        return;

      }


      if (!selectedAttendance) {

        alert(
          "Silakan pilih kehadiran terlebih dahulu."
        );

        return;

      }


      submitButton.disabled =
        true;


      submitButton.textContent =
        "Mengirim...";


      try {

        const formData =
          new URLSearchParams();


        formData.append(
          "name",
          name
        );


        formData.append(
          "message",
          message
        );


        formData.append(
          "attendance",
          selectedAttendance
        );


        formData.append(
          "pax",
          pax
        );


        await fetch(
          API_URL,
          {
            method: "POST",
            mode: "no-cors",
            body: formData
          }
        );


        success.style.display =
          "block";


        form.reset();


        attendanceButtons.forEach(
          function(btn) {

            btn.classList.remove(
              "active"
            );

          }
        );


        selectedAttendance =
          "";


        setTimeout(
          function() {

            success.style.display =
              "none";

          },
          5000
        );


        setTimeout(
          loadMessages,
          1000
        );


      } catch (err) {

        console.error(
          "Error:",
          err
        );


        error.style.display =
          "block";

      }


      submitButton.disabled =
        false;


      submitButton.textContent =
        "Kirim Reservasi";

    }
  );

}


/* =====================================
   LOAD DATA GOOGLE SHEET
===================================== */

async function loadMessages() {

  const list =
    document.getElementById(
      "messageList"
    );


  if (!list) {
    return;
  }


  list.innerHTML =
    '<div class="loading">Memuat ucapan...</div>';


  try {

    const response =
      await fetch(
        API_URL + "?action=getMessages",
        {
          method: "GET",
          cache: "no-store"
        }
      );


    const data =
      await response.json();


    let messages =
      [];


    if (
      Array.isArray(data)
    ) {

      messages =
        data;

    } else if (
      Array.isArray(data.data)
    ) {

      messages =
        data.data;

    } else if (
      Array.isArray(data.messages)
    ) {

      messages =
        data.messages;

    }


    renderMessages(
      messages
    );


  } catch (err) {

    console.error(
      "Gagal mengambil data:",
      err
    );


    list.innerHTML =
      '<div class="loading">Belum ada ucapan & doa.</div>';


    updateStats(
      []
    );

  }

}


/* =====================================
   RENDER MESSAGES
===================================== */

function renderMessages(
  messages
) {

  const list =
    document.getElementById(
      "messageList"
    );


  list.innerHTML =
    "";


  if (
    !messages ||
    messages.length === 0
  ) {

    list.innerHTML =
      '<div class="loading">Belum ada ucapan & doa.</div>';


    updateStats(
      []
    );


    return;

  }


  messages
    .slice()
    .reverse()
    .forEach(
      function(item) {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "message glass";


        const name =
          escapeHTML(
            item.name || ""
          );


        const message =
          escapeHTML(
            item.message || ""
          );


        const attendance =
          String(
            item.attendance || ""
          ).toLowerCase();


        const pax =
          Number(
            item.pax || 0
          );


        const attendanceText =
          attendance === "hadir"
            ? "✓ Hadir"
            : "✗ Tidak Hadir";


        div.innerHTML = `

          <p class="message-name">
            ${name}
          </p>

          <p class="message-text">
            ${message}
          </p>

          <div class="message-meta">

            ${attendanceText}
            ·
            ${pax}
            orang

          </div>

        `;


        list.appendChild(
          div
        );

      }
    );


  updateStats(
    messages
  );

}


/* =====================================
   STATISTICS
===================================== */

function updateStats(
  messages
) {

  const total =
    messages.length;


  const hadir =
    messages.filter(
      function(item) {

        return (
          String(
            item.attendance || ""
          ).toLowerCase()
          === "hadir"
        );

      }
    ).length;


  const tidakHadir =
    messages.filter(
      function(item) {

        return (
          String(
            item.attendance || ""
          ).toLowerCase()
          === "tidak hadir"
        );

      }
    ).length;


  const totalTamu =
    messages.reduce(
      function(sum, item) {

        return (
          sum +
          Number(
            item.pax || 0
          )
        );

      },
      0
    );


  document.getElementById(
    "statTotal"
  ).textContent =
    total;


  document.getElementById(
    "statHadir"
  ).textContent =
    hadir;


  document.getElementById(
    "statTidakHadir"
  ).textContent =
    tidakHadir;


  document.getElementById(
    "statTamu"
  ).textContent =
    totalTamu;

}


/* =====================================
   SECURITY
===================================== */

function escapeHTML(
  text
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(
      text
    );


  return div.innerHTML;

}


/* =====================================
   INITIAL LOAD
===================================== */

loadMessages();
