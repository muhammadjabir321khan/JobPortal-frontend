function AuthForm({ fields = [], onSubmit, buttonText }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    fields.forEach((field) => {
      if (field.type === 'file') {
        data[field.name] = formData.get(field.name);
        return;
      }
      data[field.name] = formData.get(field.name);
    });

    onSubmit(data);
  };

  const radioField = fields.find((f) => f.type === 'radio');
  const normalFields = fields.filter((f) => f.type !== 'radio');

  return (
    <form onSubmit={handleSubmit}>
      {normalFields.map((field, index) => (
        <div className="mb-3" key={index}>
          <label className="form-label fw-semibold">{field.label}</label>

          {field.type === 'file' ? (
            <input
              type="file"
              name={field.name}
              className="form-control"
              accept="image/*"
              required={field.required ?? true}
            />
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              placeholder={field.placeholder}
              className="form-control"
              required={field.required ?? true}
            />
          )}
        </div>
      ))}
      {radioField && (
        <div className="mb-3">
          <label className="form-label fw-semibold">{radioField.label}</label>
          <div className="d-flex gap-3 mt-2">
            {radioField.options?.map((opt, i) => (
              <div className="form-check" key={i}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={radioField.name}
                  value={opt.value}
                  id={`${radioField.name}-${i}`}
                  defaultChecked={i === 0}
                />
                <label className="form-check-label" htmlFor={`${radioField.name}-${i}`}>
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          {buttonText}
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
