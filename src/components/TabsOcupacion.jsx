function TabsOcupacion({ pestañas, pestañaActiva, onCambiar }) {
  return (
    <div className="detalle-tabs" role="tablist" aria-label="Información de la ocupación">
      {pestañas.map((pestaña) => (
        <button
          key={pestaña.id}
          type="button"
          role="tab"
          aria-selected={pestaña.id === pestañaActiva}
          className={pestaña.id === pestañaActiva ? "tab-activa" : ""}
          onClick={() => onCambiar(pestaña.id)}
        >
          {pestaña.titulo}
        </button>
      ))}
    </div>
  );
}

export default TabsOcupacion;
