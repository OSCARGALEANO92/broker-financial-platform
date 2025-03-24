import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import "./Prestamos.css";
import { API_BASE } from "../config";

const Prestamos = () => {
  const navigate = useNavigate();
  const { agregarPrestamo } = useContext(GlobalContext);
  const [bancos, setBancos] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    documento: "",
    fechaNacimiento: "",
    estadoCivil: "",
    celular: "",
    correo: "",
    nacionalidad: "",
    direccion: "",
    ciudad: "",
    empresa: "",
    ruc: "",
    actividadEmpresa: "",
    ingresos: "",
    antiguedad: "",
    referencias: [
      { nombre: "", relacion: "", celular: "" },
      { nombre: "", relacion: "", celular: "" },
      { nombre: "", relacion: "", celular: "" }
    ],
    monto: "",
    plazo: "",
    destino: "",
    bancoSeleccionado: [],
    coodeudor: false,
    documentos: {
      cedula: [],
      factura: [],
      salario: [],
      certificado: [],
      cct: [],
      ruc: [],
      iva: [],
      cartaoferta: [],
      tazacion: [],
      extracto: [],
      cedulacodeudor: [],
    },
  });

  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [interes, setInteres] = useState(0);
  const [cuota, setCuota] = useState("");
  const [errors, setErrors] = useState({});

  const formatNumber = (value) => {
    return new Intl.NumberFormat("es-ES").format(value.replace(/\D/g, ""));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (["ingresos", "monto", "plazo"].includes(name)) {
      let numericValue = value.replace(/\D/g, "");
      let formattedValue = new Intl.NumberFormat("es-ES").format(numericValue);
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["ingresos", "monto", "plazo"].includes(name)) {
      let numericValue = value.replace(/\D/g, "");
      setFormData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  useEffect(() => {
    fetch(API_BASE.bancos)
      .then((res) => res.json())
      .then((data) => setBancos(data))
      .catch((err) => console.error("Error al cargar bancos:", err));
  }, []);

  const handleBankSelection = (e) => {
    const bancoSeleccionado = bancos.find((bank) => bank.entidad === e.target.value);
    setFormData((prev) => ({
      ...prev,
      bancoSeleccionado: e.target.value,
    }));
    setInteres(bancoSeleccionado ? parseFloat(bancoSeleccionado.tasaInteres) : 0);
    setErrors((prevErrors) => ({ ...prevErrors, bancoSeleccionado: "" }));
  };

  const calcularCuota = () => {
    const monto = parseFloat(formData.monto.replace(/\./g, ""));
    const plazo = parseInt(formData.plazo.replace(/\./g, ""));
    const tasaMensual = interes / 100 / 12;

    if (!isNaN(monto) && !isNaN(plazo) && interes > 0) {
      const cuotaMensual = Math.round((monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo)));
      const formattedCuota = new Intl.NumberFormat("es-ES").format(cuotaMensual.toFixed(2));
      setCuota(`Cuota mensual: $${formattedCuota}`);
    } else {
      setCuota("Ingrese valores válidos");
    }
  };

  const handleFileUpload = (event, tipoDocumento) => {
    const files = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      documentos: {
        ...prevData.documentos,
        [tipoDocumento]: [...prevData.documentos[tipoDocumento], ...files],
      },
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      ["nombres", "documento", "fechaNacimiento", "estadoCivil", "celular", "correo", "direccion", "barrio", "ciudad"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "Este campo es obligatorio";
      });
    } else if (step === 2) {
      ["empresa", "ruc", "actividadEmpresa", "ingresos", "antiguedad"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "Este campo es obligatorio";
      });
    } else if (step === 3) {
      ["referencia1", "relacion1", "celular1"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "Este campo es obligatorio";
      });
    } else if (step === 4) {
      ["monto", "plazo", "destino"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "Este campo es obligatorio";
      });
      if (!formData.bancoSeleccionado) newErrors["bancoSeleccionado"] = "Seleccione un banco";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => (prev < 5 ? prev + 1 : prev));
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setMensaje("✅ Solicitud Procesada con Éxito");

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    Object.entries(formData.documentos).forEach(([tipo, archivos]) => {
      archivos.forEach((archivo) => {
        formDataToSend.append(tipo, archivo);
      });
    });

    fetch(API_BASE.prestamos, {
      method: "POST",
      body: formDataToSend,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then((nuevoClienteCreado) => {
        agregarPrestamo(nuevoClienteCreado);
        navigate("/clientes");
      })
      .catch((err) => console.error("Error al enviar:", err));
  };

  return (
    <div className="prestamos-container">
      <h2 className="prestamos-title">SOLICITUD DE PRÉSTAMO</h2>

      {mensaje ? (
        <div className="prestamos-mensaje">{mensaje}</div>
      ) : (
        <form onSubmit={handleSubmit} className="prestamos-form-container">
          
          {/* 📌 SECCIÓN 1: DATOS DEL FIRMANTE */}
      {step === 1 && (
    <fieldset className="prestamos-form-section">
     <legend>Datos Personales (Todos los campos son obligatorios)</legend>
      <div className="prestamos-form-grid">
        <input type="text" name="nombres" placeholder="Nombres y Apellidos" onChange={handleChange} required />
        <input type="text" name="documento" placeholder="N° de Documento" onChange={handleChange} required />

      {/* 🔹 Campo de fecha con descripción */}
      <div className="label-input-container">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" onChange={handleChange} required />
      </div>

      <input type="text" name="estadoCivil" placeholder="Estado Civil" onChange={handleChange} required/>
      <input type="text" name="celular" placeholder="N° Celular" onChange={handleChange} required />
      <input type="email" name="correo" placeholder="Correo Electrónico" onChange={handleChange} required/>
      <input type="text" name="direccion" placeholder="Dirección Particular" onChange={handleChange} required />
      <input type="text" name="barrio" placeholder="Barrio" onChange={handleChange} required/>
      <input type="text" name="ciudad" placeholder="Ciudad" onChange={handleChange} required/>
    </div>
  </fieldset>
)}

{/* 📌 SECCIÓN 2: DATOS LABORALES */}
{step === 2 && (
  <fieldset className="prestamos-form-section">
    <legend>Datos Laborales (Todos los campos son obligatorios)</legend>
    <div className="prestamos-form-grid">
      <input
        type="text"
        name="empresa"
        placeholder="Nombre de la Empresa"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ruc"
        placeholder="RUC"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="actividadEmpresa"
        placeholder="Actividad de la Empresa"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ingresos"
        placeholder="Ingresos Mensuales"
        value={formData.ingresos}
        onBlur={handleBlur}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="antiguedad"
        placeholder="Antigüedad Laboral (ej: 3 años)"
        onChange={handleChange}
        required
      />
    </div>
  </fieldset>
)}


          {/* 📌 SECCIÓN 3: REFERENCIAS PERSONALES */}
          {step === 3 && (
  <fieldset className="prestamos-form-section">
    <legend>Referencias Personales (Todos los campos son obligatorios)</legend>
    <div className="prestamos-form-grid">
      {/* Referencia 1 */}
      <input type="text" name="referencia1" placeholder="Nombre y Apellido" onChange={handleChange} required />
      <input type="text" name="relacion1" placeholder="Relación" onChange={handleChange} required />
      <input type="text" name="celular1" placeholder="N° Celular" onChange={handleChange} required />
      <br />

      {/* Referencia 2 */}
      <input type="text" name="referencia2" placeholder="Nombre y Apellido" onChange={handleChange} required />
      <input type="text" name="relacion2" placeholder="Relación" onChange={handleChange} required />
      <input type="text" name="celular2" placeholder="N° Celular" onChange={handleChange} required />
      <br />

      {/* Referencia 3 */}
      <input type="text" name="referencia3" placeholder="Nombre y Apellido" onChange={handleChange} required />
      <input type="text" name="relacion3" placeholder="Relación" onChange={handleChange} required />
      <input type="text" name="celular3" placeholder="N° Celular" onChange={handleChange} required />
    </div>
  </fieldset>
          )}

          {/* 📌 SECCIÓN 4: SOLICITUD DE PRÉSTAMO Y ADJUNTAR DOCUMENTOS */}
{step === 4 && (
  <fieldset className="prestamos-form-section">
    <legend>Solicitud de Préstamo (Todos los campos son obligatorios)</legend>
    <div className="prestamos-form-grid">
      <input type="text" name="monto" placeholder="Monto del Préstamo" value={formData.monto} onBlur={handleBlur} onChange={handleChange} required />
      <input type="text" name="plazo" placeholder="Plazo" onBlur={handleBlur} onChange={handleChange} required/>
      <input type="text" name="destino" placeholder="Destino" onChange={handleChange} required/>

      <div className="bank-wrapper">
        <select name="bancoSeleccionado" id="bancos" onChange={handleBankSelection} className="bank-select">
          <option value="">Seleccione un banco</option>
          {bancos.map((banco) => (
            <option key={banco.entidad} value={banco.entidad}>
              {banco.entidad} - {banco.tasaInteres}%
            </option>
          ))}
        </select>
        </div>    

                <div className="calculator-container">
                  <button type="button" className="calculate-button" onClick={calcularCuota}>
                    Calcular Cuota
                  </button>
                  <p className="cuota-result">{cuota}</p>
                </div>
                </div>  

    <fieldset className="prestamos-form-section prestamos-step-4">
      <legend>Adjuntar Documentos</legend>
      <p className="prestamos-instrucciones">📄 Adjunta los documentos requeridos</p>
      <div className="prestamos-documentos-grid">
        {[
          { key: "cedula", label: "Cédula de Identidad" },
          { key: "factura", label: "Factura Servicios Públicos" },
          { key: "salario", label: "Liquidación de Salario (últimos 6 meses)" },
          { key: "certificado", label: "Certificado de Trabajo o Comprobante de IPS" },
          { key: "cct", label: "Certificado de Cumplimiento Tributario (CCT) al día" },
          { key: "ruc", label: "Comprobante de RUC" },
          { key: "iva", label: "Últimos 12 Formularios 120 IVA" },
          { key: "cartaoferta", label: "Carta Oferta del Inmueble" },
          { key: "tazacion", label: "Tasación del Inmueble" },
          { key: "extracto", label: "Extracto de Cuenta Bancaria" },
          { key: "cedulacodeudor", label: "Cédula de Identidad Codeudor" },
        ].map(({ key, label }) => (
          <label key={key}>
            {label}:
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e, key)}
              className="prestamos-file-upload"
            />
            {formData.documentos[key].length > 0 && (
              <ul className="prestamos-file-list">
                {formData.documentos[key].map((file, index) => (
                  <li key={index} className="prestamos-file-name">
                    ✅ {file.name}
                  </li>
                ))}
              </ul>
            )}
          </label>
        ))}
      </div>
    </fieldset>

    <label className="checkbox-container">
      <input type="checkbox" name="coodeudor" onChange={(e) => setFormData({ ...formData, coodeudor: e.target.checked })} />
      <span>¿Incluye Coodeudor?</span>
    </label>
  </fieldset>
)}

          {/* 📌 BOTONES DE NAVEGACIÓN */}
          <div className="button-container">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="button button-back">
                Atrás
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="button button-next">
                Siguiente
              </button>
            ) : (
              <button type="submit" className="button button-submit">
                Enviar Solicitud
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Prestamos;



















