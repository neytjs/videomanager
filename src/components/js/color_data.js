// this just holds the base data for all our CSS, the default settings that are loaded into the colors.db the first time they start the app
class ColorData {
  static color_storage() {
    return {
      div_a_textdecoration: "underline",
      div_a_size: "18",
      div_a_color: "#2DB31B",
      div_alink_textdecoration: "yes",
      div_avisited_textdecoration: "underline",
      div_avisited_color: "#14720A",
      div_avisited_fontweight: "normal",
      div_ahover_color: "#000000",
      div_ahover_testdecoration: "none",
      div_ahover_cursor: "pointer",

      table_fontfamily: 'Arial, Helvetica, sans-serif',
      table_width: "100%",
      table_bordercollapse: "collapse",
      table_td_th_fontsize: "1.2em",
      table_td_th_border: "1px solid #98bf21",
      table_td_th_padding: "3px 7px 2px 7px",
      table_th_fontsize: "1.4em",
      table_th_textalign: "left",
      table_th_paddingtop: "5px",
      table_th_paddingbottom: "4px",
      table_th_backgroundcolor: "#A7C942",
      table_th_color: "#FFFFFF",
      table_td_color: "#E9F1CF",

      ui_padding: "3px",
      ui_border: "1px solid #000000",
      ui_background: "#EBEBE0",
      ui_borderradius: "5px",

      button_borderradius: "5px",
      button_fontsize: "15px",
      button_backgroundcolor: "#00C000",
      button_color: "#000000",
      button_border: "1px solid #000000",
      button_margin: "5px 5px",
      button_padding: "0 15px",
      button_lineheight: "1.45",
      button_width: "auto",
      button_cursor: "pointer",
      button_boxshadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",

      button_hover_backgroundcolor: "#40FF40",
      button_hover_color: "#037103",
      button_hover_border: "1px solid #037103",

      button_active_backgroundcolor: "#008000",
      button_active_color: "#000000",
      button_active_border: "1px solid #000000",

      input_border: "#000000 1px solid",
      input_borderradius: "3px",
      input_backgroundcolor: "#97FD97",
      input_padding: "3px",

      input_hover_backgroundcolor: "#C2FEC2",

      body_background_color: "#F1EECF"
    }
  }
}

export default ColorData;
