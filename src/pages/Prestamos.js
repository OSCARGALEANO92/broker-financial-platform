import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Prestamos.css"; 

const Prestamos = () => {
  const navigate = useNavigate(); 
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
    fechaCobro: "",
    referencias: [{ nombre: "", relacion: "", celular: "" }],
    monto: "",
    plazo: "",
    destino: "",
    bancos: [],
    coodeudor: false,
    documentos: {
      cedula: null,
      ruc: null,
      iva: null,
      salario: null
    },
  });

  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [interes, setInteres] = useState(0);
  const [cuota, setCuota] = useState("");

  // Lista de bancos con tasas de interés
  const bancosDisponibles = [
    { nombre: "Banco Ueno", tasa: 10 },
    { nombre: "Banco Itau", tasa: 8 },
    { nombre: "Banco Basa", tasa: 9 },
    { nombre: "Banco Familiar", tasa: 10.5 },
    { nombre: "Banco Sudameris", tasa: 11 },
    { nombre: "Banco Nacional de Fomento", tasa: 9.5 },
    { nombre: "Banco Atlas", tasa: 9 },
  ];

  const formatNumber = (value) => {
  return new Intl.NumberFormat("es-ES").format(value.replace(/\D/g, ""));
};

const handleBlur = (e) => {
  const { name, value } = e.target;

  if (["ingresos", "monto", "plazo"].includes(name)) {
    let numericValue = value.replace(/\D/g, ""); // Solo números
    let formattedValue = new Intl.NumberFormat("es-ES").format(numericValue); // Aplicar separadores de miles

    setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (["ingresos", "monto", "plazo"].includes(name)) {
      // Formatear el número con separadores de miles
      let numericValue = value.replace(/\D/g, ""); // Solo números

      setFormData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleBankSelection = (e) => {
    const selectedBank = bancosDisponibles.find(bank => bank.nombre === e.target.value);
    setFormData({ ...formData, bancos: [e.target.value] });
    setInteres(selectedBank ? selectedBank.tasa : 0);
  };

  // Calcular cuota con formato de miles
  const calcularCuota = () => {
    const monto = parseFloat(formData.monto.replace(/\./g, ""));
    const plazo = parseInt(formData.plazo.replace(/\./g, ""));
    const tasaMensual = (interes / 100) / 12;

    if (!isNaN(monto) && !isNaN(plazo) && interes > 0) {
      const cuotaMensual = Math.round((monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo)));
      const formattedCuota = new Intl.NumberFormat("es-ES").format(cuotaMensual.toFixed(2));
      setCuota(`Cuota mensual: $${formattedCuota}`);
    } else {
      setCuota("Ingrese valores válidos");
    }
  };

  const handleFileUpload = (e, docType) => {
    setFormData({
      ...formData,
      documentos: {
        ...formData.documentos,
        [docType]: e.target.files[0],
      },
    });
  };

  const handleNext = () => {
    setStep(prev => prev < 5 ? prev + 1 : prev); // 🔹 Evita que se pase de 5
  };
  const handleBack = () => {
    setStep(prev => prev > 1 ? prev - 1 : prev); // 🔹 Evita que baje de 1
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario Enviado:", formData);
    setMensaje("✅ Solicitud Procesada con Éxito");

    setTimeout(() => {
      navigate("/");
    }, 3000);
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
    <legend>Datos Personales</legend>
    <div className="prestamos-form-grid">
      <input type="text" name="nombres" placeholder="Nombres y Apellidos" onChange={handleChange} required />
      <input type="text" name="documento" placeholder="N° de Documento" onChange={handleChange} required />

      {/* 🔹 Campo de fecha con descripción */}
      <div className="label-input-container">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" onChange={handleChange} required />
      </div>

      <input type="text" name="estadoCivil" placeholder="Estado Civil" onChange={handleChange} />
      <input type="text" name="celular" placeholder="N° Celular" onChange={handleChange} required />
      <input type="email" name="correo" placeholder="Correo Electrónico" onChange={handleChange} />
      <input type="text" name="direccion" placeholder="Dirección Particular" onChange={handleChange} required />
      <input type="text" name="barrio" placeholder="Barrio" onChange={handleChange} />
      <input type="text" name="ciudad" placeholder="Ciudad" onChange={handleChange} />
    </div>
  </fieldset>
)}

{/* 📌 SECCIÓN 2: DATOS LABORALES */}
{step === 2 && (
  <fieldset className="prestamos-form-section">
    <legend>Datos Laborales</legend>
    <div className="prestamos-form-grid">
      <input type="text" name="empresa" placeholder="Nombre de la Empresa" onChange={handleChange} required />
      <input type="text" name="ruc" placeholder="RUC" onChange={handleChange} required />
      <input type="text" name="actividadEmpresa" placeholder="Actividad de la Empresa" onChange={handleChange} />
      <input type="text" name="ingresos" placeholder="Ingresos Mensuales" value={formData.ingresos} onBlur={handleBlur} onChange={handleChange} />

      {/* 🔹 Campo de fecha con descripción */}
      <div className="label-input-container">
        <label htmlFor="fechaCobro">Fecha de Cobro</label>
        <input type="date" id="fechaCobro" name="fechaCobro" onChange={handleChange} />
      </div>
    </div>
  </fieldset>
)}


          {/* 📌 SECCIÓN 3: REFERENCIAS PERSONALES */}
          {step === 3 && (
            <fieldset className="prestamos-form-section">
              <legend>Referencias Personales</legend>
              <div className="prestamos-form-grid">
                <input type="text" name="referencia1" placeholder="Nombre y Apellido" onChange={handleChange} />
                <input type="text" name="relacion1" placeholder="Relación" onChange={handleChange} />
                <input type="text" name="celular1" placeholder="N° Celular" onChange={handleChange} />
                <br></br>
                <input type="text" name="referencia1" placeholder="Nombre y Apellido" onChange={handleChange} />
                <input type="text" name="relacion1" placeholder="Relación" onChange={handleChange} />
                <input type="text" name="celular1" placeholder="N° Celular" onChange={handleChange} />
                <br></br>
                <input type="text" name="referencia1" placeholder="Nombre y Apellido" onChange={handleChange} />
                <input type="text" name="relacion1" placeholder="Relación" onChange={handleChange} />
                <input type="text" name="celular1" placeholder="N° Celular" onChange={handleChange} />
              </div>
            </fieldset>
          )}

          {/* 📌 SECCIÓN 4: SOLICITUD DE PRÉSTAMO Y ADJUNTAR DOCUMENTOS */}
{step === 4 && (
  <fieldset className="prestamos-form-section">
    <legend>Solicitud de Préstamo</legend>
    <div className="prestamos-form-grid">
      <input type="text" name="monto" placeholder="Monto del Préstamo" value={formData.monto} onBlur={handleBlur} onChange={handleChange} required />
      <input type="text" name="plazo" placeholder="Plazo" onBlur={handleBlur} onChange={handleChange} required/>
      <input type="text" name="destino" placeholder="Destino" onChange={handleChange} />

      <div className="bank-container">
                  <label htmlFor="bancos">Seleccionar Banco:</label>
                  <select name="bancos" id="bancos" onChange={handleBankSelection} className="bank-select">
                    <option value="">Seleccione un banco</option>
                    {bancosDisponibles.map((banco) => (
                      <option key={banco.nombre} value={banco.nombre}>
                        {banco.nombre} - {banco.tasa}%
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

    {/* 📌 Adjuntar Documentos */}
    <fieldset className="prestamos-form-section prestamos-step-4">
      <legend>Adjuntar Documentos</legend>
      <p className="prestamos-instrucciones">📄 Adjunta los documentos requeridos.</p>
      <div className="prestamos-documentos-grid">
        <label>
          Copia Cédula de Identidad:
          <input type="file" onChange={(e) => handleFileUpload(e, "cedula")} className="prestamos-file-upload" />
          {formData.documentos.cedula && <span className="prestamos-file-name">✅ {formData.documentos.cedula.name}</span>}
        </label>

        <label>
          Comprobante de RUC:
          <input type="file" onChange={(e) => handleFileUpload(e, "ruc")} className="prestamos-file-upload" />
          {formData.documentos.ruc && <span className="prestamos-file-name">✅ {formData.documentos.ruc.name}</span>}
        </label>

        <label>
          Últimos 12 Formularios 120 IVA:
          <input type="file" onChange={(e) => handleFileUpload(e, "iva")} className="prestamos-file-upload" />
          {formData.documentos.iva && <span className="prestamos-file-name">✅ {formData.documentos.iva.name}</span>}
        </label>

        <label>
          Liquidación de Salario (últimos 6 meses):
          <input type="file" onChange={(e) => handleFileUpload(e, "salario")} className="prestamos-file-upload" />
          {formData.documentos.salario && <span className="prestamos-file-name">✅ {formData.documentos.salario.name}</span>}
        </label>
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



















