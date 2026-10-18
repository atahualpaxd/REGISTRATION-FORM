document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enrollmentForm");
  const btnClear = document.getElementById("btnClear");
  
  const docTypeRadios = document.querySelectorAll('input[name="docType"]');
  const docNumberInput = document.getElementById("docNumber");
  const birthDateInput = document.getElementById("birthDate");
  const ageInput = document.getElementById("age");
  const courseCheckboxes = document.querySelectorAll('input[name="course"]');
  const totalPriceElement = document.getElementById("totalPrice");
  
  const modal = document.getElementById("successModal");
  const modalMessage = document.getElementById("modalMessage");
  const btnModalClose = document.getElementById("btnModalClose");


  docTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      docNumberInput.value = ""; 
      if (radio.value === "DNI") {
        docNumberInput.maxLength = 8;
        docNumberInput.placeholder = "Ingrese 8 dígitos numéricos";
      } else {
        docNumberInput.maxLength = 9;
        docNumberInput.placeholder = "Ingrese 9 dígitos numéricos";
      }
    });
  });

  docNumberInput.addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });


  
  courseCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      // Cuenta cuántos checkboxes están marcados
      const seleccionados = document.querySelectorAll('input[name="course"]:checked').length;
      // Multiplica por 100
      const total = seleccionados * 100;
      // Muestra en la casilla
      totalPriceElement.textContent = `S/ ${total.toFixed(2)}`;
    });
  });


  
  birthDateInput.addEventListener("change", () => {
    if (!birthDateInput.value) {
      ageInput.value = "";
      return;
    }
    const birthDate = new Date(birthDateInput.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Si aún no ha pasado su cumpleaños este año, restamos 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    ageInput.value = isNaN(age) || age < 0 ? "" : age;
  });


  btnClear.addEventListener("click", () => {
    form.reset();
    clearErrors();
    totalPriceElement.textContent = "S/ 0.00";
    docNumberInput.maxLength = 8; 
    docNumberInput.placeholder = "Ingrese 8 dígitos numéricos";
  });


  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    clearErrors();      

    let isValid = true; 

    const docType = document.querySelector('input[name="docType"]:checked').value;
    const docNumber = docNumberInput.value.trim();

    if (docType === "DNI" && docNumber.length !== 8) {
      showError("errorDocNumber", "El DNI requiere exactamente 8 dígitos.");
      isValid = false;
    } else if (docType === "CE" && docNumber.length !== 9) {
      showError("errorDocNumber", "El Carnet de Extranjería requiere exactamente 9 dígitos.");
      isValid = false;
    }

    const fullName = document.getElementById("fullName").value.trim();
    if (fullName === "") {
      showError("errorFullName", "Ingrese sus nombres y apellidos.");
      isValid = false;
    }

    if (!birthDateInput.value) {
      showError("errorBirthDate", "Seleccione su fecha de nacimiento.");
      isValid = false;
    } else {
      const bDate = new Date(birthDateInput.value);
      const currentYear = new Date().getFullYear();
      
      const limitDate = new Date(currentYear, 9, 1);
      
      let calcAge = limitDate.getFullYear() - bDate.getFullYear();
      const m = limitDate.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && limitDate.getDate() < bDate.getDate())) {
        calcAge--;
      }

      if (calcAge < 16) {
        showError("errorBirthDate", "Debe tener 16 años cumplidos antes del 1 de octubre.");
        isValid = false;
      }
    }

    const mobile = document.getElementById("mobilePhone").value.trim();
    if (!/^9\d{8}$/.test(mobile)) {
      showError("errorMobilePhone", "El celular debe iniciar con 9 y tener 9 dígitos.");
      isValid = false;
    }

    const areaCode = document.getElementById("areaCode").value.trim();
    const landline = document.getElementById("landline").value.trim();
    if (areaCode.length !== 2 || landline.length !== 7) {
      showError("errorLandline", "Ingrese código de área (2) y número local (7).");
      isValid = false;
    }

    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      showError("errorGender", "Seleccione su sexo.");
      isValid = false;
    }

    const schoolType = document.querySelector('input[name="schoolType"]:checked');
    if (!schoolType) {
      showError("errorSchoolType", "Seleccione su colegio de procedencia.");
      isValid = false;
    }

    const checkCursos = document.querySelectorAll('input[name="course"]:checked');
    if (checkCursos.length === 0) {
      showError("errorCourses", "Debe seleccionar al menos 1 curso.");
      isValid = false;
    }

    const checkTurnos = document.querySelectorAll('input[name="shift"]:checked');
    if (checkTurnos.length === 0) {
      showError("errorShifts", "Debe seleccionar al menos un turno.");
      isValid = false;
    }

    if (isValid) {
      modalMessage.textContent = `Sus datos son correctos, usted ha sido matriculado [${fullName}].`;
      modal.style.display = "flex";
    }
  });

  function showError(elementId, message) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(span => {
      span.textContent = "";
    });
  }

  btnModalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
});