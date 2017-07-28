function getColoredParagraph(string, colors, escapeCharacter)
{
    escapeCharacter = escapeCharacter || "`";

    var indices = [];

    for (var i = 0; i < string.length; ++i)
        if (string.charAt(i) == escapeCharacter)
            indices.push(i);

    if (indices.length != colors.length)
        throw "Color string formatting does not match color count";

    var paragraph = document.createElement("p");

    var strings = string.split(escapeCharacter);

    var spans = [];

    spans.push("<span style=\"color: white" + "\">" + strings[0] + "</span>");

    for (var i = 0; i < colors.length; ++i)
        spans.push("<span style=\"color: " + colors[i].toString() + "\">" + strings[i + 1] + "</span>");

    for (var i = 0; i < spans.length; ++i)
        paragraph.innerHTML = paragraph.innerHTML + spans[i];

    return paragraph;
}

function Option(string, colors, returnValue)
{
    this.string = string;
    this.colors = colors;
    this.returnValue = returnValue;
}

function OptionSet(options, onOption, promptCharacter)
{
    this.options = options;
    this.onOption = onOption;
    this.promptCharacter = promptCharacter || ">";
}

OptionSet.prototype.print = function(onElement)
{
    onElement = onElement || document.body;

    var paras = [];

    var self = this;

    var selected = 0;

    function onKeyUp(e)
    {
        var prevSelected = selected;

        if (e.keyCode == 38) //up
        {
            --selected;

            if (selected < 0)
                selected = self.options.length - 1;
        }

        if (e.keyCode == 40) //down
        {
            ++selected;

            if (selected >= self.options.length)
                selected = 0;
        }

        if (selected != prevSelected)
        {
            paras[prevSelected].style.textDecoration = "none";

            paras[selected].style.textDecoration = "underline";
        }

        if (e.keyCode == 13) //enter
        {
            onSelect(selected);
        }
    }

    function onMouseOver()
    {
        var prevSelected = selected;

        selected = paras.indexOf(this);
        
        if (selected != prevSelected)
        {
            paras[prevSelected].style.textDecoration = "none";

            paras[selected].style.textDecoration = "underline";
        }
    }

    function onParaClick()
    {
        var index = paras.indexOf(this);

        onSelect(index);
    }

    function onSelect(index)
    {
        for (var i = 0; i < paras.length; ++i)
        {
            paras[i].onclick = null;
            paras[i].onmouseover = null;
        }

        onElement.onkeyup = null;

        paras[selected].style.textDecoration = "none";

        self.onOption(self.options[index].returnValue);
    }

    for (var i = 0; i < this.options.length; ++i)
    {
        var para = getColoredParagraph(this.promptCharacter + " " + this.options[i].string, this.options[i].colors);

        para.onclick = onParaClick;
        para.onmouseover = onMouseOver;
        onElement.onkeyup = onKeyUp;

        paras.push(para);
    }

    paras[selected].style.textDecoration = "underline";

    for (var i = 0; i < paras.length; ++i)
        onElement.appendChild(paras[i]);
};

function clearConsole(onElement)
{
    onElement = onElement || document.body;

    while (onElement.firstChild)
        onElement.removeChild(onElement.firstChild);
}

function printBlank(count, onElement)
{
    onElement = onElement || document.body;

    for (var i = 0; i < count; ++i)
        onElement.appendChild(document.createElement("br"));
}

function printText(text, onElement)
{
    onElement = onElement || document.body;

    var p = document.createElement("p");

    p.innerHTML = text;

    onElement.appendChild(p);
}

function printColoredText(text, colors, onElement)
{
    onElement = onElement || document.body;

    onElement.appendChild(getColoredParagraph(text, colors));
}

function Terminal(onElement)
{
    this.onElement = onElement;
}

Terminal.prototype.printSet = function(optionSet)
{
    optionSet.print(this.onElement);
};

Terminal.prototype.clear = function()
{
    clearConsole(this.onElement);
};

Terminal.prototype.printBlank = function(count)
{
    printBlank(count, this.onElement);
};

Terminal.prototype.printText = function(text)
{
    printText(text, this.onElement);
};

Terminal.prototype.printColoredText = function(text, colors)
{
    printColoredText(text, colors, this.onElement);
};