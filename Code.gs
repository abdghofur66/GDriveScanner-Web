function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('Google Drive Folder Scanner')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fungsi utama yang dipanggil dari frontend.
 * @param {string} folderId ID dari Google Drive Folder.
 * @param {boolean} includeFiles Opsi apakah file di dalam folder juga disisir.
 * @return {object} { success: boolean, data: array, message: string }
 */
function getSubFoldersFromUser(folderId, includeFiles) {
  try {
    var parentFolder;
    
    // JALUR KHUSUS: Jika user mengetik 'root' atau 'mydrive'
    if (folderId.toLowerCase() === 'root' || folderId.toLowerCase() === 'mydrive') {
      
      // PROTEKSI KEAMANAN PUBLIK: 
      // Mencegah kebocoran data root Drive developer jika aplikasi di-deploy dengan pengaturan 'Execute as: Me'
      // dan diakses oleh pengguna Publik (Anonim).
      var activeUser = Session.getActiveUser().getEmail();
      var effectiveUser = Session.getEffectiveUser().getEmail();
      
      if (activeUser !== effectiveUser && activeUser === "") {
        return { 
          success: false, 
          message: "Akses 'root' dinonaktifkan pada mode Publik demi melindungi privasi sistem. Silakan masukkan link/ID Folder Google Drive secara spesifik." 
        };
      }
      
      parentFolder = DriveApp.getRootFolder();
    } else {
      parentFolder = DriveApp.getFolderById(folderId);
    }
    
    var list = [];
    
    // Panggil fungsi rekursif untuk menyisir folder
    getFolderContentsSorted(parentFolder, list, 0, includeFiles); 
    
    // Return dengan format standard JSON sukses backend
    return { 
      success: true, 
      data: list 
    };
    
  } catch (e) {
    // Return dengan format JSON gagal jika akses ditolak atau ID salah
    return { 
      success: false, 
      message: "Folder tidak ditemukan, link tidak valid, atau Anda tidak memiliki izin. (Pastikan akses folder Google Drive-nya di-setting 'Siapa saja yang memiliki link / Anyone with the link')" 
    };
  }
}

// Fungsi rekursif untuk menyusun Pohon Folder dan File.
function getFolderContentsSorted(parent, list, level, includeFiles) {
  // Mengatur jarak spasi (indentasi) sesuai kedalaman hierarki
  var prefix = "";
  if (level > 0) {
    prefix = "\u00A0\u00A0\u00A0\u00A0".repeat(level - 1) + "└─ ";
  }

  // ==========================================
  // 1. BAGIAN MENGAMBIL DAN MENGURUTKAN FOLDER
  // ==========================================
  var childFolders = parent.getFolders();
  var foldersArray = [];
  
  while (childFolders.hasNext()) {
    foldersArray.push(childFolders.next());
  }
  
  // Urutkan folder secara NATURAL (A-Z, 0-9, angka berurutan secara logis)
  foldersArray.sort(function(a, b) {
    return a.getName().localeCompare(b.getName(), undefined, { 
      numeric: true, 
      sensitivity: 'base' 
    });
  });
  
  // Masukkan folder ke daftar utama, lalu selami isinya
  for (var i = 0; i < foldersArray.length; i++) {
    var folder = foldersArray[i];
    
    list.push({
      name: prefix + folder.getName(),
      url: folder.getUrl(),
      isFile: false 
    });
    
    // Selami isi sub-folder ini (Level + 1)
    getFolderContentsSorted(folder, list, level + 1, includeFiles);
  }

  // ==========================================
  // 2. BAGIAN MENGAMBIL DAN MENGURUTKAN FILE
  // ==========================================
  if (includeFiles) {
    var childFiles = parent.getFiles();
    var filesArray = [];
    
    while (childFiles.hasNext()) {
      filesArray.push(childFiles.next());
    }
    
    // Urutkan file secara NATURAL (A-Z, 0-9, angka berurutan secara logis)
    filesArray.sort(function(a, b) {
      return a.getName().localeCompare(b.getName(), undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      });
    });

    // Masukkan file ke daftar utama
    for (var j = 0; j < filesArray.length; j++) {
      var file = filesArray[j];
      
      list.push({
        name: prefix + file.getName(),
        url: file.getUrl(),
        isFile: true 
      });
    }
  }
}