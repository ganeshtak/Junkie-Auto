import React from "react";
import { View, Text } from 'react-native';
import { Store } from "../Store";
import { lang_code } from "../Store/Actions/LangAction";



export const AppText = ({
    children,
    style,
    numberOfLines
}) => {
    const [textLang, setLang] = React.useState(Store.getState().LangReducer.selected_lang);

    Store.subscribe(() => {
        setLang(Store.getState().LangReducer.selected_lang);
    })


    React.useEffect(() => {

    }, [textLang]);

    return (
        <Text
            style={{
                ...style,
                textAlign: textLang == lang_code.ar ? "right" : "left",
            }}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    )
}