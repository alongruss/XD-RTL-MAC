
//TODO - Deal with adding and deleting chars
//TODO - Deal with in-editor text selection
//TODO - Fix breaking bug when dealing with gradients
//TODO - Add a verbose comment mode


const React = require("react");
const styles = require('./App.css');
const { editDocument } = require("application");
const { Text, Color } = require("scenegraph");
const assets = require("assets");

let VERBOSE = true;

class App extends React.Component {

  constructor(props) {
    super(props);

    if (VERBOSE) console.log('(alon:) Entered constructor.');
    this.panel = React.createRef();
    this.documentStateChanged = this.documentStateChanged.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateOriginal = this.updateOriginal.bind(this);
    this.breakStyleRanges = this.breakStyleRanges.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.onDoneClick = this.onDoneClick.bind(this);

    // we don't know yet that we have anything in the selection or that it's a text object
    // so we can't populate state variables yet.
    if (VERBOSE) console.log('(alon:) Setting initial state variables.');
    this.state = {
      oldTextObject: {},
      newTextObject: {},
      preview: "",
      currentColor: { r: 0, g: 0, b: 0 },
      assetColors: assets.colors.get(),
      assetColorsSelectedId: 0,
      fontSize: 32,
      isBold: false,
      isItalic: false,
      isUnderline: false
    };

    // if there are no asset colors we default to black
    if (this.state.assetColors.length == 0) {
      if (VERBOSE) console.log('(alon:) No asset colors found, defaulting to Black.');
      this.state.assetColors = [{ color: { value: 4278190080 } }];
    }



    /*

    this.findChange = (oldString, newString) => {

    }


    this.styleRangeToHtml = (text, styleRange) => { //! nothing renders if one of theese are null

      let fontColor = styleRange.fill.value.toString(16);
      let previewFontSize = Math.floor(styleRange.fontSize * 0.2);
      let isUnderline = styleRange.underline ? "underline" : "none";
      let isStrikethrough = styleRange.strikethrough ? "line-through" : "none";
      return `<span style=" 
          margin: 0px;
          padding: 0px;
          font-size: ${previewFontSize}px;
          font-weight: ${styleRange.fontStyle == "Bold" ? "bold" : "default"}
          font-family: ${styleRange.fontFamily};
          font-style: ${styleRange.fontStyle};
          text-decoration: ${isUnderline} ${isStrikethrough};
          color: rgba(${parseInt(fontColor.substr(2, 2), 16)},${parseInt(fontColor.substr(4, 2), 16)},${parseInt(fontColor.substr(6, 2), 16)},1);
      ">${text}</span>`;
      //

    }


    this.renderStyledText = () => {
      let renderHtml = "";
      // build styled text from text value and styleRanges
      for (let i = 0; i < this.state.newTextObject.text.length; i++) {
        let styleRange = this.state.newTextObject.styleRanges[i];
        if (styleRange == undefined) styleRange = {
          length: 1,
          fontSize: 100,
          fontFamily: "Arial",
          fontStyle: "Regular",
          underline: false,
          strikethrough: false,
          fill: { value: 4278190080 }
        };
        if (styleRange.fill == null) styleRange.fill = { value: 4278190080 };
        renderHtml += this.styleRangeToHtml(this.state.newTextObject.text[i], styleRange);
      }
      //update the preview
      this.setState({ preview: renderHtml });

    }

    

    this.onColorChange = (e) => {
      if (e.target.name == 'r') this.setState({
        currentColor: { r: Math.floor(e.target.value), g: this.state.currentColor.g, b: this.state.currentColor.b }
      });
      if (e.target.name == 'g') this.setState({
        currentColor: { r: this.state.currentColor.r, g: Math.floor(e.target.value), b: this.state.currentColor.b }
      });
      if (e.target.name == 'b') this.setState({
        currentColor: { r: this.state.currentColor.r, g: this.state.currentColor.g, b: Math.floor(e.target.value) }
      });
    }



   
 * /
    this.componentDidMount = () => {

    }

*/

  }

  updateOriginal() {
    this.props.selection.items[0].text = this.state.newTextObject.text;
    this.props.selection.items[0].styleRanges = this.state.newTextObject.styleRanges;
  }

  onInputChange(e) {
    var updatedText = this.state.newTextObject;
    updatedText.text = e.target.value;
    //this.findChange(this.state.newTextObject.text,updatedText.text);
    // There are 3 possible situations:

    if (updatedText.text.length > updatedText.styleRanges.length) {
      if (VERBOSE) console.log('(alon:) updatedText.text.length > updatedText.styleRanges.length');
      // 1. we added text so text length is now bigger then style length
      // we need to know the indexes that were added!
      // we can add a default style or continue existing an style
      /*if (changeIndex > 1) {
updatedText.styleRanges.splice(changeIndex, 0, updatedText.styleRanges[changeIndex - 1]);
} else {
updatedText.styleRanges.splice(changeIndex, 0, updatedText.styleRanges[changeIndex + 1]);
}*/
      for (let i = 0; i < updatedText.text.length; i++) {
        if (updatedText.styleRanges[i] == undefined) {


          updatedText.styleRanges[i] = {
            length: 1,
            fontSize: this.state.fontSize,
            fontFamily: "Arial",
            fontStyle: this.state.isBold ? "Bold" : this.state.isItalic ? "Italic" : "Regular",
            underline: this.state.isUnderline,
            strikethrough: false,
            fill: { value: parseInt(this.state.assetColors[this.state.assetColorsSelectedId].color.value) }
          };
        }
      }

    } else if (updatedText.text.length < updatedText.styleRanges.length) {
      if (VERBOSE) console.log('(alon:) updatedText.text.length < updatedText.styleRanges.length');
      // 2. we removed chars so and we need to remove style with them
      // let's remove from the end
      let numToRemove = updatedText.styleRanges.length - updatedText.text.length;
      updatedText.styleRanges = updatedText.styleRanges.slice(0, -numToRemove);
    } else {
      if (VERBOSE) console.log('(alon:) updatedText.text.length == updatedText.styleRanges.length');
      // 3. chars changed but length remains the same

    }

    this.setState({ newTextObject: updatedText });
    //this.updateOriginal();
  };

  onDoneClick(e) {
    if (e.keyCode == '13') {
      e.stopPropagation()

    }
    //props.dialog.close();
  };

  onChangeSize(e, value) {
    if (VERBOSE) console.log('(alon:) Changing font size.');
    this.setState({ fontSize: parseInt(value) });
  }

  onButtonClick(e, value) {
    if (VERBOSE) console.log('(alon:) Clicked button: '+value);
    if (value == 'boldButton') { this.setState({ isBold: !this.state.isBold }); }
    else if (value == 'italicButton') { this.setState({ isItalic: !this.state.isItalic }); }
    else if (value == 'underlineButton') { this.setState({ isUnderline: !this.state.isUnderline }); }
    else {
      this.setState({ assetColorsSelectedId: value });
    }
  }


  documentStateChanged(selection) {
    if (this.props.selection.items[0] instanceof Text) {
      // if we know that somthing is indeed a text we can populate the state variables
      if (VERBOSE) console.log('(alon:) Got a text object.');
      if (VERBOSE) console.log('(alon:) Setting the input text as a state variable.');

      this.setState({
        oldTextObject: {
          text: this.props.selection.items[0].text,
          styleRanges: this.breakStyleRanges(this.props.selection.items[0])
        },
        newTextObject: {
          text: this.props.selection.items[0].text,
          styleRanges: this.breakStyleRanges(this.props.selection.items[0])
        }
      });




    } else {
      if (VERBOSE) console.log('(alon:) Selection is not a text object!');

      // we create a new text object
      if (VERBOSE) console.log('(alon:) Creating a new text object.');
      /* editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
         const newText = new Text();
         newText.text = " ";
       });*/
      /*
      newText.styleRanges = [
        {
          length: 1,
          fontSize: this.state.fontSize,
          fontFamily: "Arial",
          fontStyle: "Regular",
          underline: false,
          strikethrough: false,
          fill: { value: 4278190080 },
        }
      ];
  
  
      // add it to the canvas
      this.props.selection.insertionParent.addChild(newText);
      newText.moveInParentCoordinates(100, 100);
      this.props.selection.items = [newText];
  
  
      if (VERBOSE) console.log('(alon:) Setting the default text as a state variable.');
      this.state.oldTextObject = {
        text: newText.text,
        styleRanges: breakStyleRanges(this.props.selection.items[0])
      };
      this.state.newTextObject = {
        text: newText.text,
        styleRanges: breakStyleRanges(this.props.selection.items[0])
      };
  */
      //});
    }
  }


  breakStyleRanges(textObject) { /// Working!
    /*
        let newTextObject = new Text();
        for (let i = 0; i < textObject.text.length; i++) {
          newTextObject.text += textObject.text[i];
        }
    
        if (textObject.text.length > textObject.styleRanges.length) {
          // we need to break the style ranges apart
          if (VERBOSE) console.log('we need to break the style ranges apart');
          let newStyleRange = {}
          Object.assign(newStyleRange, textObject.styleRanges[0]);
          let newStyleRanges = [newStyleRange];
    
          textObject.styleRanges.forEach(styleRange => {
            for (let i = 0; i < styleRange.length; i++) {
              let newStyleRange = {
                length: 1,
                fontSize: styleRange.fontSize,
                fontFamily: styleRange.fontFamily,
                fontStyle: styleRange.fontStyle,
                underline: styleRange.underline,
                strikethrough: styleRange.strikethrough,
                fill: styleRange.fill,
              }
              if (VERBOSE) console.log('Pushing new style: ' + newStyleRange);
              newStyleRanges.push(newStyleRange);
            }
    
          });
    
          newTextObject.styleRanges = newStyleRanges;
          Object.assign(newTextObject.styleRanges, newStyleRanges);
        }
    
        if (VERBOSE) console.log('returning new Text object with ' + newTextObject.text.length + ' chars and ' + newTextObject.styleRanges.length + ' style ranges!');
        return newTextObject.styleRanges;*/
        return([]);
  }


  render() {
    return (
      <form onSubmit={this.onDoneClick}>
        <h1>RTL Text (Mac)</h1>

        <label style={{ display: "block" }}>
          <span style={{ display: "block" }}>Edit</span>
          <textarea id={"textInput"} onChange={this.onInputChange} value={`${this.state.newTextObject.text||"This is where you edit your texts"}`} />
        </label>



        <div className="button-container">
          <input type={"number"} className={`number-input`} onInput={(e) => this.onChangeSize(e, e.target.value)} defaultValue="32"></input>
          <span className={`button-block bold ${this.state.isBold ? "selected" : ""}`} onClick={(e) => this.onButtonClick(e, "boldButton")}>
            B
          </span>
          <span className={`button-block italic ${this.state.isItalic ? "selected" : ""}`} onClick={(e) => this.onButtonClick(e, "italicButton")}>
            I
          </span>
          <span className={`button-block underline ${this.state.isUnderline ? "selected" : ""}`} onClick={(e) => this.onButtonClick(e, "underlineButton")}>
            U
          </span>
        </div>
        <div className="color-container">
          {this.state.assetColors.map((value, index) => {
            value.color.value += "";
            let colorString = "#" + parseInt(value.color.value).toString(16).substr(2);
            return <div className={`color-block ${this.state.assetColorsSelectedId == index ? "selected" : ""}`} onClick={(e) => this.onButtonClick(e, index)} key={index} style={{ backgroundColor: colorString }}></div>
          })}
        </div>

        <button type="submit" uxp-variant="cta">
          Done
          </button>
        <footer>
        </footer>

        <p id={"warning"}>
          This plugin requires you to select a rectangle in the document. Please select
          a rectangle.
</p>
      </form >


    );
  }
}


/*assetColorsSelectedId
 <label style={{ display: "block" }}>
          <span style={{ display: "block" }}>Preview</span>
          <div id={"textPreview"} style={{
            flexWrap: "wrap",
            width: 250, overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto"
          }} dangerouslySetInnerHTML={{
            __html: this.state.preview
          }}></div>
        </label>

         <div style={{ width: 24, height: 24, backgroundColor: "rgb(" + this.state.currentColor.r + "," + this.state.currentColor.g + "," + this.state.currentColor.b + ")" }} ></div>
            <label style={{ display: "flex" }}>
              <span style={{ display: "block" }}>R = {this.state.currentColor.r}</span>
              <input name="r" type={"range"} min={"0"} max={"255"} onInput={this.onColorChange} />
            </label>
            <label style={{ display: "flex" }}>
              <span style={{ display: "block" }}>G = {this.state.currentColor.g}</span>
              <input name="g" type={"range"} min={"0"} max={"255"} onInput={this.onColorChange} />
            </label>
            <label style={{ display: "flex" }}>
              <span style={{ display: "block" }}>B = {this.state.currentColor.b}</span>
              <input name="b" type={"range"} min={"0"} max={"255"} onInput={this.onColorChange} />
            </label>
            <label style={{ display: "flex" }}>
              <span style={{ display: "block" }}>Size</span>
              <input type={"number"} />
            </label>
*/

module.exports = App;
