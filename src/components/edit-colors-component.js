import React, {Component} from 'react';
import Ui from './ui-component';
import ColorData from './js/color_data.js';
const color_storage = ColorData.color_storage();

class EditColors extends Component {
  constructor(props) {
    super(props);
    this.loadColors = this.loadColors.bind(this);
    this.restoreDefaults = this.restoreDefaults.bind(this);
    this.restoreSubmit = this.restoreSubmit.bind(this);

    this.state = {
      div_a_textdecoration: "",
      div_a_size: "",
      div_a_color: "",
      div_alink_textdecoration: "",
      div_avisited_textdecoration: "",
      div_avisited_color: "",
      div_avisited_fontweight: "",
      div_ahover_color: "",
      div_ahover_testdecoration: "",
      div_ahover_cursor: "",
      table_fontfamily: "",
      table_width: "",
      table_bordercollapse: "",
      table_td_th_fontsize: "",
      table_td_th_border: "",
      table_td_th_padding: "",
      table_th_fontsize: "",
      table_th_textalign: "",
      table_th_paddingtop: "",
      table_th_paddingbottom: "",
      table_th_backgroundcolor: "",
      table_th_color: "",
      table_td_color: "",
      ui_padding: "",
      ui_border: "",
      ui_background: "",
      ui_borderradius: "",
      button_borderradius: "",
      button_fontsize: "",
      button_backgroundcolor: "",
      button_color: "",
      button_border: "",
      button_margin: "",
      button_padding: "",
      button_lineheight: "",
      button_width: "",
      button_cursor: "",
      button_boxshadow: "",
      button_hover_backgroundcolor: "",
      button_hover_color: "",
      button_hover_border: "",
      button_active_backgroundcolor: "",
      button_active_color: "",
      button_active_border: "",
      input_border: "",
      input_borderradius: "",
      input_backgroundcolor: "",
      input_padding: "",
      input_hover_backgroundcolor: "",
      body_background_color: ""
    }
  }

    componentDidMount() {
      this.loadColors();
    }

    loadColors() {
      this.props.colors.findOne({}, function(err, doc) {
        this.setState(doc);
      }.bind(this));
    }

  handleSubmit(e) {
    let new_div_a_textdecoration = this.state.div_a_textdecoration;
    let new_div_a_size = this.state.div_a_size;
    let new_div_a_color = this.state.div_a_color;
    let new_div_alink_textdecoration = this.state.div_alink_textdecoration;
    let new_div_avisited_textdecoration = this.state.div_avisited_textdecoration;
    let new_div_avisited_color = this.state.div_avisited_color;
    let new_div_avisited_fontweight = this.state.div_avisited_fontweight;
    let new_div_ahover_color = this.state.div_ahover_color;
    let new_div_ahover_testdecoration = this.state.div_ahover_testdecoration;
    let new_div_ahover_cursor = this.state.div_ahover_cursor;
    let new_table_fontfamily = this.state.table_fontfamily;
    let new_table_width = this.state.table_width;
    let new_table_bordercollapse = this.state.table_bordercollapse;
    let new_table_td_th_fontsize = this.state.table_td_th_fontsize;
    let new_table_td_th_border = this.state.table_td_th_border;
    let new_table_td_th_padding = this.state.table_td_th_padding;
    let new_table_th_fontsize = this.state.table_th_fontsize;
    let new_table_th_textalign = this.state.table_th_textalign;
    let new_table_th_paddingtop = this.state.table_th_paddingtop;
    let new_table_th_paddingbottom = this.state.table_th_paddingbottom;
    let new_table_th_backgroundcolor = this.state.table_th_backgroundcolor;
    let new_table_th_color = this.state.table_th_color;
    let new_table_td_color = this.state.table_td_color;
    let new_ui_padding = this.state.ui_padding;
    let new_ui_border = this.state.ui_border;
    let new_ui_background = this.state.ui_background;
    let new_ui_borderradius = this.state.ui_borderradius;
    let new_button_borderradius = this.state.button_borderradius;
    let new_button_fontsize = this.state.button_fontsize;
    let new_button_backgroundcolor = this.state.button_backgroundcolor;
    let new_button_color = this.state.button_color;
    let new_button_border = this.state.button_border;
    let new_button_margin = this.state.button_margin;
    let new_button_padding = this.state.button_padding;
    let new_button_lineheight = this.state.button_lineheight;
    let new_button_width = this.state.button_width;
    let new_button_cursor = this.state.button_cursor;
    let new_button_boxshadow = this.state.button_boxshadow;
    let new_button_hover_backgroundcolor = this.state.button_hover_backgroundcolor;
    let new_button_hover_color = this.state.button_hover_color;
    let new_button_hover_border = this.state.button_hover_border;
    let new_button_active_backgroundcolor = this.state.button_active_backgroundcolor;
    let new_button_active_color = this.state.button_active_color;
    let new_button_active_border = this.state.button_active_border;
    let new_input_border = this.state.input_border;
    let new_input_borderradius = this.state.input_borderradius;
    let new_input_backgroundcolor = this.state.input_backgroundcolor;
    let new_input_padding = this.state.input_padding;
    let new_input_hover_backgroundcolor = this.state.input_hover_backgroundcolor;
    let new_body_background_color = this.state.body_background_color;

      new_div_a_textdecoration = new_div_a_textdecoration.trim();
      new_div_a_size = new_div_a_size.trim();
      new_div_a_color = new_div_a_color.trim();
      new_div_alink_textdecoration = new_div_alink_textdecoration.trim();
      new_div_avisited_textdecoration = new_div_avisited_textdecoration.trim();
      new_div_avisited_color = new_div_avisited_color.trim();
      new_div_avisited_fontweight = new_div_avisited_fontweight.trim();
      new_div_ahover_color = new_div_ahover_color.trim();
      new_div_ahover_testdecoration = new_div_ahover_testdecoration.trim();
      new_div_ahover_cursor = new_div_ahover_cursor.trim();
      new_table_fontfamily = new_table_fontfamily.trim();
      new_table_width = new_table_width.trim();
      new_table_bordercollapse = new_table_bordercollapse.trim();
      new_table_td_th_fontsize = new_table_td_th_fontsize.trim();
      new_table_td_th_border = new_table_td_th_border.trim();
      new_table_td_th_padding = new_table_td_th_padding.trim();
      new_table_th_fontsize = new_table_th_fontsize.trim();
      new_table_th_textalign = new_table_th_textalign.trim();
      new_table_th_paddingtop = new_table_th_paddingtop.trim();
      new_table_th_paddingbottom = new_table_th_paddingbottom.trim();
      new_table_th_backgroundcolor = new_table_th_backgroundcolor.trim();
      new_table_th_color = new_table_th_color.trim();
      new_table_td_color = new_table_td_color.trim();
      new_ui_padding = new_ui_padding.trim();
      new_ui_border = new_ui_border.trim();
      new_ui_background = new_ui_background.trim();
      new_ui_borderradius = new_ui_borderradius.trim();
      new_button_borderradius = new_button_borderradius.trim();
      new_button_fontsize = new_button_fontsize.trim();
      new_button_backgroundcolor = new_button_backgroundcolor.trim();
      new_button_color = new_button_color.trim();
      new_button_border = new_button_border.trim();
      new_button_margin = new_button_margin.trim();
      new_button_padding = new_button_padding.trim();
      new_button_lineheight = new_button_lineheight.trim();
      new_button_width = new_button_width.trim();
      new_button_cursor = new_button_cursor.trim();
      new_button_boxshadow = new_button_boxshadow.trim();
      new_button_hover_backgroundcolor = new_button_hover_backgroundcolor.trim();
      new_button_hover_color = new_button_hover_color.trim();
      new_button_hover_border = new_button_hover_border.trim();
      new_button_active_backgroundcolor = new_button_active_backgroundcolor.trim();
      new_button_active_color = new_button_active_color.trim();
      new_button_active_border = new_button_active_border.trim();
      new_input_border = new_input_border.trim();
      new_input_borderradius = new_input_borderradius.trim();
      new_input_backgroundcolor = new_input_backgroundcolor.trim();
      new_input_padding = new_input_padding.trim();
      new_input_hover_backgroundcolor = new_input_hover_backgroundcolor.trim();
      new_body_background_color = new_body_background_color.trim();

    this.props.colors.update({}, {
      $set: {
        div_a_textdecoration: new_div_a_textdecoration,
        div_a_size: new_div_a_size,
        div_a_color: new_div_a_color,
        div_alink_textdecoration: new_div_alink_textdecoration,
        div_avisited_textdecoration: new_div_avisited_textdecoration,
        div_avisited_color: new_div_avisited_color,
        div_avisited_fontweight: new_div_avisited_fontweight,
        div_ahover_color: new_div_ahover_color,
        div_ahover_testdecoration: new_div_ahover_testdecoration,
        div_ahover_cursor: new_div_ahover_cursor,
        table_fontfamily: new_table_fontfamily,
        table_width: new_table_width,
        table_bordercollapse: new_table_bordercollapse,
        table_td_th_fontsize: new_table_td_th_fontsize,
        table_td_th_border: new_table_td_th_border,
        table_td_th_padding: new_table_td_th_padding,
        table_th_fontsize: new_table_th_fontsize,
        table_th_textalign: new_table_th_textalign,
        table_th_paddingtop: new_table_th_paddingtop,
        table_th_paddingbottom: new_table_th_paddingbottom,
        table_th_backgroundcolor: new_table_th_backgroundcolor,
        table_th_color: new_table_th_color,
        table_td_color: new_table_td_color,
        ui_padding: new_ui_padding,
        ui_border: new_ui_border,
        ui_background: new_ui_background,
        ui_borderradius: new_ui_borderradius,
        button_borderradius: new_button_borderradius,
        button_fontsize: new_button_fontsize,
        button_backgroundcolor: new_button_backgroundcolor,
        button_color: new_button_color,
        button_border: new_button_border,
        button_margin: new_button_margin,
        button_padding: new_button_padding,
        button_width: new_button_width,
        button_cursor: new_button_cursor,
        button_boxshadow: new_button_boxshadow,
        button_hover_backgroundcolor: new_button_hover_backgroundcolor,
        button_hover_color: new_button_hover_color,
        button_hover_border: new_button_hover_border,
        button_active_backgroundcolor: new_button_active_backgroundcolor,
        button_active_color: new_button_active_color,
        button_active_border: new_button_active_border,
        input_border: new_input_border,
        input_borderradius: new_input_borderradius,
        input_backgroundcolor: new_input_backgroundcolor,
        input_padding: new_input_padding,
        input_hover_backgroundcolor: new_input_hover_backgroundcolor,
        body_background_color: new_body_background_color
      }
    }, function(err, doc) {
      window.location.reload();
    });
  }

// to restore default settings
  restoreDefaults() {
    return new Promise(resolve => {
      let state = Object.assign({}, this.state);
      for (var current_val in state) {
        for (var default_val in color_storage) {
          if (current_val === default_val) {
            state[current_val] = color_storage[default_val];
          }
        }
      }
      resolve(state);
    });
  }

  async restoreSubmit() {
    let state = await this.restoreDefaults();
    this.setState(state);
    this.handleSubmit.bind(this)();
  }

  handle_div_a_textdecoration_Change(event) {
    this.setState({ div_a_textdecoration: event.target.value });
  }

  handle_div_a_size_Change(event) {
    this.setState({ div_a_size: event.target.value });
  }

  handle_div_a_color_Change(event) {
    this.setState({ div_a_color: event.target.value });
  }

  handle_div_alink_textdecoration_Change(event) {
    this.setState({ div_alink_textdecoration: event.target.value });
  }

  handle_div_avisited_textdecoration_Change(event) {
    this.setState({ div_avisited_textdecoration: event.target.value });
  }

  handle_div_avisited_color_Change(event) {
    this.setState({ div_avisited_color: event.target.value });
  }

  handle_div_avisited_fontweight_Change(event) {
    this.setState({ div_avisited_fontweight: event.target.value });
  }

  handle_div_ahover_color_Change(event) {
    this.setState({ div_ahover_color: event.target.value });
  }

  handle_div_ahover_testdecoration_Change(event) {
    this.setState({ div_ahover_testdecoration: event.target.value });
  }

  handle_div_ahover_cursor_Change(event) {
    this.setState({ div_ahover_cursor: event.target.value });
  }

  handle_table_fontfamily_Change(event) {
    this.setState({ table_fontfamily: event.target.value });
  }

  handle_table_width_Change(event) {
    this.setState({ table_width: event.target.value });
  }

  handle_table_bordercollapse_Change(event) {
    this.setState({ table_bordercollapse: event.target.value });
  }

  handle_table_td_th_fontsize_Change(event) {
    this.setState({ table_td_th_fontsize: event.target.value });
  }

  handle_table_td_th_border_Change(event) {
    this.setState({ table_td_th_border: event.target.value });
  }

  handle_table_td_th_padding_Change(event) {
    this.setState({ table_td_th_padding: event.target.value });
  }

  handle_table_th_fontsize_Change(event) {
    this.setState({ table_th_fontsize: event.target.value });
  }

  handle_table_th_textalign_Change(event) {
    this.setState({ table_th_textalign: event.target.value });
  }

  handle_table_th_paddingtop_Change(event) {
    this.setState({ table_th_paddingtop: event.target.value });
  }

  handle_table_th_paddingbottom_Change(event) {
    this.setState({ table_th_paddingbottom: event.target.value });
  }

  handle_table_th_backgroundcolor_Change(event) {
    this.setState({ table_th_backgroundcolor: event.target.value });
  }

  handle_table_th_color_Change(event) {
    this.setState({ table_th_color: event.target.value });
  }

  handle_table_td_color_Change(event) {
    this.setState({ table_td_color: event.target.value });
  }

  handle_ui_padding_Change(event) {
    this.setState({ ui_padding: event.target.value });
  }

  handle_ui_border_Change(event) {
    this.setState({ ui_border: event.target.value });
  }

  handle_ui_background_Change(event) {
    this.setState({ ui_background: event.target.value });
  }

  handle_ui_borderradius_Change(event) {
    this.setState({ ui_borderradius: event.target.value });
  }

  handle_button_borderradius_Change(event) {
    this.setState({ button_borderradius: event.target.value });
  }

  handle_button_fontsize_Change(event) {
    this.setState({ button_fontsize: event.target.value });
  }

  handle_button_backgroundcolor_Change(event) {
    this.setState({ button_backgroundcolor: event.target.value });
  }

  handle_button_color_Change(event) {
    this.setState({ button_color: event.target.value });
  }

  handle_button_border_Change(event) {
    this.setState({ button_border: event.target.value });
  }

  handle_button_margin_Change(event) {
    this.setState({ button_margin: event.target.value });
  }

  handle_button_padding_Change(event) {
    this.setState({ button_padding: event.target.value });
  }

  handle_button_lineheight_Change(event) {
    this.setState({ button_lineheight: event.target.value });
  }

  handle_button_width_Change(event) {
    this.setState({ button_width: event.target.value });
  }

  handle_button_cursor_Change(event) {
    this.setState({ button_cursor: event.target.value });
  }

  handle_button_boxshadow_Change(event) {
    this.setState({ button_boxshadow: event.target.value });
  }

  handle_button_hover_backgroundcolor_Change(event) {
    this.setState({ button_hover_backgroundcolor: event.target.value });
  }

  handle_button_hover_color_Change(event) {
    this.setState({ button_hover_color: event.target.value });
  }

  handle_button_hover_border_Change(event) {
    this.setState({ button_hover_border: event.target.value });
  }

  handle_button_active_backgroundcolor_Change(event) {
    this.setState({ button_active_backgroundcolor: event.target.value });
  }

  handle_button_active_color_Change(event) {
    this.setState({ button_active_color: event.target.value });
  }

  handle_button_active_border_Change(event) {
    this.setState({ button_active_border: event.target.value });
  }

  handle_input_border_Change(event) {
    this.setState({ input_border: event.target.value });
  }

  handle_input_borderradius_Change(event) {
    this.setState({ input_borderradius: event.target.value });
  }

  handle_input_backgroundcolor_Change(event) {
    this.setState({ input_backgroundcolor: event.target.value });
  }

  handle_input_padding_Change(event) {
    this.setState({ input_padding: event.target.value });
  }

  handle_input_hover_backgroundcolor_Change(event) {
    this.setState({ input_hover_backgroundcolor: event.target.value });
  }

  handle_body_background_color_Change(event) {
    this.setState({ body_background_color: event.target.value });
  }

  render() {
    return (
      <div>
        <Ui currentLoc={"colors"} colorData={this.props.colorData}></Ui>
        <h3>Edit colors:</h3>
        Note, you must insert proper CSS values to have the desired effect.
        <hr/>
        a text-decoration: <input value={this.state.div_a_textdecoration} onChange={this.handle_div_a_textdecoration_Change.bind(this)}/><br/>
        a font-size: <input value={this.state.div_a_size} onChange={this.handle_div_a_size_Change.bind(this)}/><br/>
        a color: <input value={this.state.div_a_color} onChange={this.handle_div_a_color_Change.bind(this)}/><br/>
        a:link text-decoration: <input value={this.state.div_alink_textdecoration} onChange={this.handle_div_alink_textdecoration_Change.bind(this)}/><br/>
        a:visited text-decoration: <input value={this.state.div_avisited_textdecoration} onChange={this.handle_div_avisited_textdecoration_Change.bind(this)}/><br/>
        a:visited color: <input value={this.state.div_avisited_color} onChange={this.handle_div_avisited_color_Change.bind(this)}/><br/>
        a:visited font-weight: <input value={this.state.div_avisited_fontweight} onChange={this.handle_div_avisited_fontweight_Change.bind(this)}/><br/>
        a:hover color: <input value={this.state.div_ahover_color} onChange={this.handle_div_ahover_color_Change.bind(this)}/><br/>
        a:hover text-decoration: <input value={this.state.div_ahover_testdecoration} onChange={this.handle_div_ahover_testdecoration_Change.bind(this)}/><br/>
        a:hover cursor: <input value={this.state.div_ahover_cursor} onChange={this.handle_div_ahover_cursor_Change.bind(this)}/><br/>
        table font-family: <input value={this.state.table_fontfamily} onChange={this.handle_table_fontfamily_Change.bind(this)}/><br/>
        table width: <input value={this.state.table_width} onChange={this.handle_table_width_Change.bind(this)}/><br/>
        table border-collapse: <input value={this.state.table_bordercollapse} onChange={this.handle_table_bordercollapse_Change.bind(this)}/><br/>
        table td th font-size: <input value={this.state.table_td_th_fontsize} onChange={this.handle_table_td_th_fontsize_Change.bind(this)}/><br/>
        table td th border: <input value={this.state.table_td_th_border} onChange={this.handle_table_td_th_border_Change.bind(this)}/><br/>
        table td th padding: <input value={this.state.table_td_th_padding} onChange={this.handle_table_td_th_padding_Change.bind(this)}/><br/>
        table th font-size: <input value={this.state.table_th_fontsize} onChange={this.handle_table_th_fontsize_Change.bind(this)}/><br/>
        table th text-align: <input value={this.state.table_th_textalign} onChange={this.handle_table_th_textalign_Change.bind(this)}/><br/>
        table th padding-top: <input value={this.state.table_th_paddingtop} onChange={this.handle_table_th_paddingtop_Change.bind(this)}/><br/>
        table th padding-bottom: <input value={this.state.table_th_paddingbottom} onChange={this.handle_table_th_paddingbottom_Change.bind(this)}/><br/>
        table th background-color: <input value={this.state.table_th_backgroundcolor} onChange={this.handle_table_th_backgroundcolor_Change.bind(this)}/><br/>
        table th font color: <input value={this.state.table_th_color} onChange={this.handle_table_th_color_Change.bind(this)}/><br/>
        table td background-color: <input value={this.state.table_td_color} onChange={this.handle_table_td_color_Change.bind(this)}/><br/>
        ui padding: <input value={this.state.ui_padding} onChange={this.handle_ui_padding_Change.bind(this)}/><br/>
        ui border: <input value={this.state.ui_border} onChange={this.handle_ui_border_Change.bind(this)}/><br/>
        ui background: <input value={this.state.ui_background} onChange={this.handle_ui_background_Change.bind(this)}/><br/>
        ui borderradius: <input value={this.state.ui_borderradius} onChange={this.handle_ui_borderradius_Change.bind(this)}/><br/>
        button border-radius: <input value={this.state.button_borderradius} onChange={this.handle_button_borderradius_Change.bind(this)}/><br/>
        button font-size: <input value={this.state.button_fontsize} onChange={this.handle_button_fontsize_Change.bind(this)}/><br/>
        button background-color: <input value={this.state.button_backgroundcolor} onChange={this.handle_button_backgroundcolor_Change.bind(this)}/><br/>
        button color: <input value={this.state.button_color} onChange={this.handle_button_color_Change.bind(this)}/><br/>
        button border: <input value={this.state.button_border} onChange={this.handle_button_border_Change.bind(this)}/><br/>
        button margin: <input value={this.state.button_margin} onChange={this.handle_button_margin_Change.bind(this)}/><br/>
        button padding: <input value={this.state.button_padding} onChange={this.handle_button_padding_Change.bind(this)}/><br/>
        button line-height: <input value={this.state.button_lineheight} onChange={this.handle_button_lineheight_Change.bind(this)}/><br/>
        button width: <input value={this.state.button_width} onChange={this.handle_button_width_Change.bind(this)}/><br/>
        button cursor: <input value={this.state.button_cursor} onChange={this.handle_button_cursor_Change.bind(this)}/><br/>
        button box-shadow: <input value={this.state.button_boxshadow} onChange={this.handle_button_boxshadow_Change.bind(this)}/><br/>
        button hover:background-color: <input value={this.state.button_hover_backgroundcolor} onChange={this.handle_button_hover_backgroundcolor_Change.bind(this)}/><br/>
        button hover:color: <input value={this.state.button_hover_color} onChange={this.handle_button_hover_color_Change.bind(this)}/><br/>
        button hover:border: <input value={this.state.button_hover_border} onChange={this.handle_button_hover_border_Change.bind(this)}/><br/>
        button active:background-color: <input value={this.state.button_active_backgroundcolor} onChange={this.handle_button_active_backgroundcolor_Change.bind(this)}/><br/>
        button active:color: <input value={this.state.button_active_color} onChange={this.handle_button_active_color_Change.bind(this)}/><br/>
        button active:border: <input value={this.state.button_active_border} onChange={this.handle_button_active_border_Change.bind(this)}/><br/>
        input border: <input value={this.state.input_border} onChange={this.handle_input_border_Change.bind(this)}/><br/>
        input border-radius: <input value={this.state.input_borderradius} onChange={this.handle_input_borderradius_Change.bind(this)}/><br/>
        input background-color: <input value={this.state.input_backgroundcolor} onChange={this.handle_input_backgroundcolor_Change.bind(this)}/><br/>
        input padding: <input value={this.state.input_padding} onChange={this.handle_input_padding_Change.bind(this)}/><br/>
        input hover background-color: <input value={this.state.input_hover_backgroundcolor} onChange={this.handle_input_hover_backgroundcolor_Change.bind(this)}/><br/>
        body background color: <input value={this.state.body_background_color} onChange={this.handle_body_background_color_Change.bind(this)}/><br/>
        <button onClick={this.handleSubmit.bind(this)}>Submit</button> <button onClick={this.restoreSubmit}>Restore Defaults Colors</button>
      </div>
    )
  }
}

export default EditColors;
