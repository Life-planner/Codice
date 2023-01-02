import styles from "../styles/activity.module.css";

export default function Activity({
  event,
  start,
  duration,
  title,
  color = "#3A86FF",
  calendar = false,
  callback = () => {},
}) {
  function getContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
  }

  return (
    <div
      className={styles.container}
      style={{
        marginTop: `${(start * 144) / 1440}rem`,
        height: `${(duration * 144) / 1440}rem`,
        backgroundColor: color,
      }}
      onClick={() => {
        callback(event);
      }}
    >
      {calendar ? (
        <div
          className={
            getContrastYIQ(color)
              ? styles["calendar-black"]
              : styles["calendar-white"]
          }
        >
          {calendar}
        </div>
      ) : null}
      <div
        className={
          getContrastYIQ(color) ? styles["title-black"] : styles["title-white"]
        }
      >
        {title}
      </div>
    </div>
  );
}
