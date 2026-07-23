// ==========================================
// DATABASE RSVP WEDDING LUTHFI & JASMINE
// ==========================================

const SPREADSHEET_ID = "1bDASkVgGo7UuEoZI2I9pvwMtQjqWsoILrQC5TLaEPWI";
const SHEET_NAME = "RSVP";


// ==========================================
// GET DATA RSVP
// Dipanggil oleh website untuk mengambil data
// ==========================================

function doGet(e) {
  try {

    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();

    // Kalau belum ada data selain header
    if (data.length <= 1) {
      return jsonResponse([]);
    }

    const result = data.slice(1)
      .filter(function(row) {
        return row[0] !== "";
      })
      .map(function(row, index) {

        return {
          id: index + 2,
          name: row[0] || "",
          message: row[1] || "",
          attendance: row[2] || "",
          pax: Number(row[3]) || 0,
          date: row[4] || ""
        };

      });

    return jsonResponse(result);

  } catch (error) {

    return jsonResponse({
      success: false,
      error: error.message
    });

  }
}


// ==========================================
// MENYIMPAN RSVP BARU
// ==========================================

function doPost(e) {

  try {

    const sheet = getSheet();

    const data =
      JSON.parse(e.postData.contents);


    const name =
      String(data.name || "").trim();

    const message =
      String(data.message || "").trim();

    const attendance =
      String(data.attendance || "").trim();

    const pax =
      Number(data.pax) || 1;


    // Validasi nama

    if (!name) {

      return jsonResponse({
        success: false,
        error: "Nama wajib diisi."
      });

    }


    // Validasi kehadiran

    if (!attendance) {

      return jsonResponse({
        success: false,
        error: "Kehadiran wajib dipilih."
      });

    }


    // Simpan data ke Google Sheet

    sheet.appendRow([

      name,

      message,

      attendance,

      pax,

      new Date()

    ]);


    return jsonResponse({

      success: true,

      message:
        "RSVP berhasil disimpan."

    });


  } catch (error) {

    return jsonResponse({

      success: false,

      error:
        error.message

    });

  }

}


// ==========================================
// HAPUS DATA RSVP
// ==========================================

function doDelete(e) {

  try {

    const sheet =
      getSheet();


    const id =
      Number(
        e.parameter.id
      );


    if (
      !id ||
      id < 2
    ) {

      return jsonResponse({

        success: false,

        error:
          "ID tidak valid."

      });

    }


    sheet.deleteRow(id);


    return jsonResponse({

      success: true,

      message:
        "Data berhasil dihapus."

    });


  } catch (error) {

    return jsonResponse({

      success: false,

      error:
        error.message

    });

  }

}


// ==========================================
// MENGAMBIL SHEET RSVP
// ==========================================

function getSheet() {

  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );


  let sheet =
    spreadsheet.getSheetByName(
      SHEET_NAME
    );


  // Jika sheet RSVP belum ada,
  // otomatis dibuat

  if (!sheet) {

    sheet =
      spreadsheet.insertSheet(
        SHEET_NAME
      );


    // Buat header otomatis

    sheet.appendRow([

      "Nama",

      "Ucapan",

      "Kehadiran",

      "Jumlah Tamu",

      "Tanggal"

    ]);

  }


  return sheet;

}


// ==========================================
// RESPONSE JSON
// ==========================================

function jsonResponse(data) {

  return ContentService

    .createTextOutput(

      JSON.stringify(
        data
      )

    )

    .setMimeType(

      ContentService.MimeType.JSON

    );

}
