/*Component Name: ThemeVariables
Component Functional Details: User can create or update ThemeVariables details from here.
Created By: Happy
Created Date: 26/9/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import createShades from 'colorshades';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeCompanyConfigurationData } from 'redux/CompanyConfiguration/CompanyConfigurationActions';
import FontService from 'services/common/font/FontService';
import { Helmet } from 'react-helmet';
const ThemeVariables = ({ reRender }) => {
    const [data, setData] = useState({});
    const [RedColor, setRedColors] = useState("#ef4444");
    const [Lightpurple, setLightpurple] = useState("#000000");
    const [Indigo, setIndigo] = useState("#6366f1");
    const [sidebarbarColor, setsidebarbarColors] = useState("#888888");
    const [sidebartextColor, setsidebartextColor] = useState("#000000");
    const [buttontextColor, setbuttontextColor] = useState("#000000");
    const [grayColor, setgrayColor] = useState("#000000");;
    const dispatch = useDispatch();
    const companyInfo = useSelector(store => store.CompanyConfiguration);

    const [RedShadeData, setRedShadeData] = useState([])
    const [PurpleShadeData, setPurpleShadeData] = useState([])
    const [IndigoShadeData, setIndigoShadeData] = useState([])
    const [sidebarbarShadeData, setsidebarbarShadeData] = useState([])
    const [sidebartextShadeData, setsidebartextShadeData] = useState([])
    const [buttontextShadeData, setbuttontextShadeData] = useState([])
    const [grayShadeData, setgrayShadeData] = useState([])
    const [themeSetting, setThemeSetting] = useState({
        BodyFont: data?.bFontFamily || "Raleway,sans-serif",
        TitleFont: data?.pFontFamily || "Raleway,sans-serif",
        logoImg: data?.headerLogoUrl || "",
        SmSize: data?.bFontSize || "",
        SmLetterSpacing: data?.bLetterSpacing || "",
        SmLineHeight: data?.bLineHeight || "",
        SmFontWeight: data?.bFontWeight || "",
        TitleSize: data?.pFontSize || "",
        TitleLetterSpacing: data?.pLetterSpacing || "",
        TitleLineHeight: data?.pLineHeight || "",
        TitleFontWeight: data?.pFontWeight || "",
        bfontURL: "",
        pfontURL: "",
    });
    useEffect(() => {
        setData(reRender)
    }, [reRender]);


    useEffect(() => {
        setRedColors(data?.sbgActivecolor || "#ef4444")
        setLightpurple(data?.sFontcolor || "#000000")
        setIndigo(data?.cBgcolor || "#6366f1")
        setsidebarbarColors(data?.sBgcolor || "#888888");
        setsidebartextColor(data?.sActiveColor || "#000000");

        setbuttontextColor(data?.cFontcolor || "#000000")
        setgrayColor(data?.primary || "#000000")
        setThemeSetting({
            bfontURL: "",
            pfontURL: "",
            BodyFont: data?.bFontFamily || "Raleway,sans-serif",
            TitleFont: data?.pFontFamily || "Raleway,sans-serif",
            logoImg: data?.headerLogoUrl || "",
            SmSize: data?.bFontSize || "",
            SmLetterSpacing: data?.bLetterSpacing || "",
            SmLineHeight: data?.bLineHeight || "",
            SmFontWeight: data?.bFontWeight || "",
            TitleSize: data?.pFontSize || "",
            TitleLetterSpacing: data?.pLetterSpacing || "",
            TitleLineHeight: data?.pLineHeight || "",
            TitleFontWeight: data?.pFontWeight || "",
        })
        getBodyFontDataById(data?.bFontFamily)
        getTitleFontDataById(data?.pFontFamily)
        localStorage.setItem('header_logo', `"${process.env.REACT_APP_API_BLOB}${data?.headerLogoUrl + "?" + Math.random(5)}"`)
        localStorage.setItem('favicon', `${process.env.REACT_APP_API_BLOB}${data?.faviconUrl + "?" + Math.random(5)}`);
        dispatch(storeCompanyConfigurationData({ headerLogo: `${process.env.REACT_APP_API_BLOB}${data?.headerLogoUrl}` + "?" + Math.random(5) }));
        getBodyFontDataById()
        getTitleFontDataById()
    }, [data]);
    const getBodyFontDataById = useCallback((bFontFamily) => {
        if (bFontFamily) {
            FontService.getFontById(bFontFamily)
                .then((res) => {
                    var response = res.data;
                    if (response.success && response?.data) {
                        setThemeSetting((prev) => {
                            return {
                                ...prev,
                                bfontURL: response?.data?.fontUrl,
                                BodyFont: response?.data?.googleFontName,
                            };
                        });
                    }
                })
                .catch((err) => { });
        }
    }, []);
    const getTitleFontDataById = useCallback((pFontFamily) => {
        if (pFontFamily) {
            FontService.getFontById(pFontFamily)
                .then((res) => {
                    var response = res.data;
                    if (response.success && response?.data) {
                        setThemeSetting((prev) => {
                            return {
                                ...prev,
                                pfontURL: response?.data?.fontUrl,
                                TitleFont: response?.data?.googleFontName,
                            };
                        });
                    }
                })
                .catch((err) => { });
        }
    }, []);


    useEffect(() => {
        const RedShades = createShades(RedColor);
        setRedShadeData(RedShades?.colors)
        const PurpleShades = createShades(Lightpurple);
        setPurpleShadeData(PurpleShades?.colors)
        const IndigoShades = createShades(Indigo);
        setIndigoShadeData(IndigoShades?.colors)
        const sidebarbar = createShades(sidebarbarColor);
        setsidebarbarShadeData(sidebarbar?.colors)
        const sidebartext = createShades(sidebartextColor);
        setsidebartextShadeData(sidebartext?.colors)
        const buttontext = createShades(buttontextColor);
        setbuttontextShadeData(buttontext?.colors)
        const gray = createShades(grayColor);
        setgrayShadeData(gray?.colors)

    }, [RedColor, Lightpurple, Indigo, sidebarbarColor, sidebartextColor, buttontextColor, grayColor])

    useEffect(() => {
        if (RedShadeData && RedShadeData.length !== 0) {
            RedShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-red-${shade.index}`, shade.hex || data?.sbgActivecolor);
            })
        }

        if (PurpleShadeData && PurpleShadeData.length !== 0) {
            PurpleShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-lightpurple-${shade.index}`, shade.hex || data?.sFontcolor);
            })
        }

        if (IndigoShadeData && IndigoShadeData.length !== 0) {
            IndigoShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-indigo-${shade.index}`, shade.hex || data?.cBgcolor);
            })
        }
        if (sidebarbarShadeData && sidebarbarShadeData.length !== 0) {
            // console.log(/* `--color-sidebarbar-${shade.index}`, shade.hex */sidebarbarShadeData, sidebarbarColor, 'pkkk');
            sidebarbarShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-sidebarbar-${shade.index}`, shade.hex || data?.sBgcolor);
            })
        }
        if (sidebartextShadeData && sidebartextShadeData.length !== 0) {
            sidebartextShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-sidebartext-${shade.index}`, shade.hex || data?.sActiveColor);
            })
        }

        if (buttontextShadeData && buttontextShadeData.length !== 0) {
            buttontextShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-buttontext-${shade.index}`, shade.hex || data?.cFontcolor);
            })
        }
        if (grayShadeData && grayShadeData.length !== 0) {
            grayShadeData.map((shade) => {
                document.documentElement.style.setProperty(`--color-gray-${shade.index}`, shade.hex || data?.primary);
            })
        }
        document.documentElement.style.setProperty(`--body-font-url`, `url("${themeSetting.bfontURL}")`);
        document.documentElement.style.setProperty(`--page-font-url`, `url("${themeSetting.pfontURL}")`);
        document.documentElement.style.setProperty(`--body-font`, themeSetting.BodyFont);
        document.documentElement.style.setProperty(`--title-font`, themeSetting.TitleFont);
        document.documentElement.style.setProperty(`--sm-size`, `${themeSetting.SmSize}px`);
        document.documentElement.style.setProperty(`--logo-img`, `url("${process.env.REACT_APP_API_BLOB}${themeSetting.logoImg + "?" + Math.random(5)}")`);
        document.documentElement.style.setProperty(`--sm-letterSpacing`, `${themeSetting.SmLetterSpacing}px`);
        document.documentElement.style.setProperty(`--sm-lineHeight`, themeSetting.SmLineHeight);
        document.documentElement.style.setProperty(`--sm-fontWeight`, `${themeSetting.SmFontWeight}`);
        document.documentElement.style.setProperty(`--title-size`, `${themeSetting.TitleSize}px`);
        document.documentElement.style.setProperty(`--title-letterSpacing`, `${themeSetting.TitleLetterSpacing}px`);
        document.documentElement.style.setProperty(`--title-lineHeight`, themeSetting.TitleLineHeight);
        document.documentElement.style.setProperty(`--title-fontWeight`, `${themeSetting.TitleFontWeight}`);
    }, [RedShadeData, RedColor, Indigo, PurpleShadeData, Lightpurple, themeSetting, data]);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <link rel="shortcut icon" type="image/icon type" href={`${process.env.REACT_APP_API_BLOB}${data.faviconUrl + "?" + Math.random(5)}`} />
            </Helmet>
        </>
    );
};

export default ThemeVariables;
