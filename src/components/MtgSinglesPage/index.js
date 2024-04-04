import React, { useState } from 'react';
import Content from './mtgSingles';

const index = (props) => {
    const [active, setActive] = useState('all')
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));

    const singles = [
        { id: 1, name: "Amonkhet" },
        { id: 2, name: "ApocalypseAPC" },
        { id: 3, name: "AmonkhetAKH" },
        { id: 4, name: "Rivals of IxalanRIX" },
        { id: 5, name: "Rise of the EldraziROE" },
        { id: 5, name: "Ravnica Remastered - VariantsRVR2" },
        { id: 5, name: "Streets of New CapennaSNC" },
        { id: 5, name: "Streets of New Capenna CommanderNCC" },
        { id: 5, name: "ChroniclesCHR" },
        { id: 5, name: "Commander 2019C19" },
        { id: 5, name: "Commander - OversizedCMD2" },
        { id: 5, name: "Throne of Eldraine - VariantsELD2" },
        { id: 5, name: "TormentTOR" },
        { id: 6, name: "Dominaria UnitedDMU" },
        { id: 7, name: "Double Masters2XM" },
        { id: 8, name: "WorldwakeWWK" },
        { id: 8, name: "World ChampionshipWCHP" },
        { id: 8, name: "Welcome Deck 2017W17" },
        { id: 8, name: "ZendikarZEN" },
        { id: 8, name: "Zendikar Rising - VariantsZNR2" },
        { id: 8, name: "Visions" },
        { id: 8, name: "Zendikar Rising ExpeditionsZNE" },
    ];

    const groupSinglesFirstLetter = (items) => {
        return items.reduce((acc, item) => {
            const firstLetter = item.name.charAt(0).toUpperCase();
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});
    }

    const groupedSingles = groupSinglesFirstLetter(singles);
    const availableLetter = Object.keys(groupedSingles).sort();

    const handleActive = (val) => {
        setActive(val);
    }

    const contentProps = {
        letters,
        groupedSingles,
        availableLetter,
        active,
        handleActive,
        ...props
    }
    return (
        <Content {...contentProps} />
    )
}

export default index