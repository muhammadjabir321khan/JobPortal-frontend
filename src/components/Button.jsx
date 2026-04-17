function Button({ children, type = 'button', variant = 'primary', size, className, ...props }) {
  const sizeClass = size ? `btn-${size}` : '';
  const classes = ['btn', `btn-${variant}`, sizeClass, className].filter(Boolean).join(' ');
  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;