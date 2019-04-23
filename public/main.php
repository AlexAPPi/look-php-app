<html>
    <head>
        
    </head>
    <body>
        <form>
            <input name="file" type="file">
            <input name="test" type="text">
            <input name="checkbox" type="checkbox">
            <select name="select-multiple" multiple>
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3</option>
            </select>
            <select name="select">
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3</option>
            </select>
            <fieldset>
                <input type="radio" name="123" value="123">
                <input type="radio" name="123" value="213">
            </fieldset>
            <textarea name="textarea"></textarea>
            <button type="submit">Click</button>
        </form>
        <script src="js/!dev/require.min.js"></script>
        <script src="js/bundle.ts.js"></script>
        <script>require(["main"])</script>
    </body>
</html>