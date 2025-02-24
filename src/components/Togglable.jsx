import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(props.formVisibility);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    if (props.formVisibility !== undefined) {
      props.clickHandle()
    }
    setVisible(!visible);
  };

  console.log('Visibility', visible)
  console.log('Forms', props.formVisibility)

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  })

  useEffect(() => {
    setVisible(props.formVisibility);
  }, [props.formVisibility])

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} className="font-bold border-2 rounded-full border-black p-3 px-4 bg-amber-200 hover:bg-amber-300">{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button className="font-semibold border-2 rounded-full p-2 px-3 border-black bg-amber-400 hover:bg-amber-300" onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  );
})

export default Togglable;