interface Props {
  placeholder: string;
}

const Switch = ({ placeholder }: Props) => {
  return (
    <div className={`flex items-center gap-3`}>
      <label className="switch">
        <input type="checkbox" checked />
        <span className="slider"></span>
      </label>
      <p>{placeholder}</p>
    </div>
  );
};

export default Switch;
