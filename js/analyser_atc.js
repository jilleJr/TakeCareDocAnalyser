
var ATC = {};
/* Format:
ATC: {
    koder[0..263]: {
        ATC: "" String,
        kategori: "" String,
        medel[1..n]: "" String
    },

    findATC: function(läkemedel), ret String|null
    findATCs: function(läkemedel), ret [0..n]: "" String
    findATCMatches: function(läkemedel), ret [0..n]: {
        ATC: "" String,
        match: Number,
        medel[1..n]: "" String
    }
}
*/

/**
 * @param {String} läkemedel
 * @returns {String|null} Bästa matchande ATC kod, if any
*/
ATC.findATC = function(läkemedel) {
    var best = ATC.findATCMatches(läkemedel)[0];
    return best ? best.ATC : null;
};

/**
 * @param {String} läkemedel
 * @returns {String[]} Alla matchande ATC kod, eller tom lista
*/
ATC.findATCs = function(läkemedel) {
    return ATC.findATCMatches(läkemedel).map(function(atc) {
        return atc.ATC;
    });
};

/**
 * @param {String} läkemedel
 * @returns {{ATC:String, match:Number, medel:String[]}[]} Matchande ATC koder
*/
ATC.findATCMatches = function(läkemedel) {
    läkemedel = läkemedel.trim().toLowerCase();
    var firstWordLength = läkemedel.match(/[\wåäáàöóòíìïúùüéèë]*/i)[0].length;

    var matches = [];
    for (var gi = 0; gi < ATC.koder.length; gi++) {
        var group = ATC.koder[gi];
        var max = 0;
        var matchedMedel = [];

        for (var mi = 0; mi < group.medel.length; mi++) {
            var medel = group.medel[mi].toLowerCase();
            var matchingChars = medel.countMatchingChars(läkemedel);

            if (matchingChars >= firstWordLength)
                matchedMedel.push(medel);

            if (matchingChars > max)
                max = matchingChars;
        }

        if (matchedMedel.length > 0) {
            matches.push({
                ATC: group.ATC,
                match: max,
                medel: group.medel
            });
        }
    }

    matches.sort(function(a,b) {
        return b.match - a.match;
    });

    return matches;
};

ATC.koder = [{"ATC": "J01AA02","kategori": "Doxycyklin","medel": ["Doxycyklin EQL Pharma, EQL Pharma, tablett 100 mg","Doxyferm, Nordic Drugs, koncentrat till infusionsvätska, lösning 20 mg/ml","Doxyferm, Nordic Drugs, tablett 100 mg","Oracea, Galderma Nordic, kapsel med modifierad frisättning, hård 40 mg","Vibranord, Pharmanovia, oral suspension 10 mg/ml Vibranord, Pharmanovia, tablett 100 mg","Doxycyklin 2care4","Doxycyklin Ebb"]},{"ATC": "J01AA04","kategori": "Lymecyklin","medel": ["Lymecycline Actavis","Lymelysal","Tetralysal"]},{"ATC": "J01AA05","kategori": "Metacyklin","medel": ["Lymecycline Actavis","Lymelysal","Tetralysal"]},{"ATC": "J01AA07","kategori": "Tetracyklin","medel": ["Tetracyklin Meda"]},{"ATC": "J01AA12","kategori": "Tigecyklin","medel": ["Tygacil"]},{"ATC": "J01BA","kategori": "Amfenikoler","medel": ["Kloramfenikol CCS","Kloramfenikol Santen"]},{"ATC": "J01CA01","kategori": "Ampicillin","medel": ["Doktacillin"]},{"ATC": "J01CA04","kategori": "Amoxicillin","medel": ["Amimox","Amoxicillin Aurobindo","Amoxicillin Mylan","Amoxicillin Sandoz","Imacillin"]},{"ATC": "J01CA08","kategori": "Pivmecillinam","medel": ["Penomax","Selexid"]},{"ATC": "J01CA12","kategori": "Piperacillin","medel": ["Piperacillin/Tazobactam Fresenius Kabi","Piperacillin/Tazobactam Reig Jofre","Piperacillin/Tazobactam Sandoz","Piperacillin/Tazobactam Stragen","Piperacillin/Tazobaktam AB Unimedic Vial Mate"]},{"ATC": "J01CA13","kategori": "Tikarcillin","medel": ["Tikacillin, Filmdragerad tablett 1 g","Tikacillin, Filmdragerad tablett 800 mg"]},{"ATC": "J01CA18","kategori": "Hetacillin","medel": ["Heracillin"]},{"ATC": "J01CE01","kategori": "Bensylpenicillin","medel": ["Bensylpenicillin Meda","Benzylpenicillin Panpharma"]},{"ATC": "J01CE02","kategori": "Fenoximetylpenicillin (penicillin V)","medel": ["Avopenin","Fenoximetylpenicillin EQL Pharma","Kåvepenin","Kåvepenin Frukt","Tikacillin"]},{"ATC": "J01CF02","kategori": "Kloxacillin","medel": ["Cloxacillin Stragen","Ekvacillin"]},{"ATC": "J01CF05","kategori": "Flukloxacillin","medel": ["Flucloxacillin Orion","Flucloxacillin Sandoz","Flukloxacillin Meda","Heracillin","Ekvacillin (Kloxacillin)"]},{"ATC": "J01CR02","kategori": "Amoxicillin och enzymhämmare","medel": ["Amoxicillin/Clavulanic acid Aurobindo","Amoxicillin/Clavulanic acid BB","Betaklav","Bioclavid","Klaximol","Spektramox","Amoxicillin/Clavulanic acid 2care4","Amoxicillin/Klavulansyra Ebb"]},{"ATC": "J01CR03","kategori": "Tikarcillin och betalaktamashämmare","medel": ["Tikacillin"]},{"ATC": "J01DB04","kategori": "Cefazolin","medel": ["Cefazolin MIP"]},{"ATC": "J01DB05","kategori": "Cefadroxil","medel": ["Cefadroxil Mylan","Cefadroxil Sandoz","Cefamox löslig"]},{"ATC": "J01DC02","kategori": "Cefuroxim","medel": ["Aprokam (Cefuroxim)","Zinacef (Cefuroxim)","Ceftriaxon Fresenius Kabi","Ceftriaxon Stragen","Ceftriaxon Villerton"]},{"ATC": "J01DD01","kategori": "Cefotaxim","medel": ["Cefotaxim MIP","Cefotaxim Sandoz","Cefotaxim Stragen","Cefotaxim Villerton"]},{"ATC": "J01DD02","kategori": "Ceftazidim","medel": ["Ceftazidim Sandoz","Fortum"]},{"ATC": "J01DD04","kategori": "Ceftriaxon","medel": ["Ceftriaxon Fresenius Kabi","Ceftriaxon MIP","Ceftriaxon Stragen","Ceftriaxon Villerton","Rocephalin med lidokain (Ceftriaxon)"]},{"ATC": "J01DD52","kategori": "Ceftazidim och betalaktamashämmare","medel": ["Zavicefta"]},{"ATC": "J01DD54","kategori": "Ceftriaxon, kombinationer","medel": ["Rocephalin med lidokain"]},{"ATC": "J01DE01","kategori": "Cefepim","medel": ["Cefepim MIP"]},{"ATC": "J01DF01","kategori": "Aztreonam","medel": ["Azactam","Cayston"]},{"ATC": "J01DH02","kategori": "Meropenem","medel": ["Meropenem Fresenius Kabi","Meropenem Hexal","Meropenem Hospira","Meropenem Mylan","Meropenem STADA","Meronem (Meropenemanhydrat)"]},{"ATC": "J01DH03","kategori": "Ertapenem","medel": ["Ertapenem Fresenius Kabi","Invanz"]},{"ATC": "J01DH51","kategori": "Imipenem och cilastatin","medel": ["Imipenem/Cilastatin Fresenius Kabi","Tienam"]},{"ATC": "J01EA01","kategori": "Trimetoprim","medel": ["Idotrim","Trimetoprim Meda"]},{"ATC": "J01EC01","kategori": "Sulfametoxazol","medel": ["Bactrim","Bactrim forte","Eusaprim","Eusaprim forte"]},{"ATC": "J01EC02","kategori": "Sulfadiazin","medel": ["Sulfadiazin","Sulfadiazin-natrium","Azasulf","Comcillin","Debenal","Penicillin-trippel-sulfa","Pharmadiazin mite","Pharmadiazin","Pyrimal","Sulfadital mite","Sulfadital","Sulphatriad","Trimin sulfa","Trisulf"]},{"ATC": "J01FA01","kategori": "Erytromycin","medel": ["Abboticin","Abboticin Novum","Ery-Max","Erythromycin Panpharma","Erythromycin Ebb"]},{"ATC": "J01FA06","kategori": "Roxitromycin","medel": ["Roximstad","Surlid"]},{"ATC": "J01FA09","kategori": "Klaritromycin","medel": ["Clarithromycin Aurobindo (Klaritromycin)","Clarithromycin HEC Pharm (Klaritromycin)","Clarithromycin Krka (Klaritromycin)","Klacid (Klaritromycin)","Nexium HP (Klaritromycin)","Klacid (Klaritromycin)"]},{"ATC": "J01FA10","kategori": "Azitromycin","medel": ["Azithromycin Jubilant","Azithromycin Krka","Azithromycin Mylan","Azithromycin Orifarm","Azithromycin Sandoz","Azithromycin STADA","Azitromax","Azyter","Azitromycin Ebb"]},{"ATC": "J01FF01","kategori": "Klindamycin","medel": ["Clindamycin Actavis","Clindamycin Alternova","Clindamycin Orifarm","Dalacin","Dalacin","Klindamycin Ebb"]},{"ATC": "J01GB01","kategori": "Tobramycin","medel": ["Nebcina","Tobi","TOBI Podhaler"]},{"ATC": "J01GB06","kategori": "Amikacin","medel": ["Biklin"]},{"ATC": "J01MA02","kategori": "Ciprofloxacin","medel": ["Ciprofloxacin Accord","Ciprofloxacin Amneal","Ciprofloxacin Bluefish","Ciprofloxacin Fresenius Kabi","Ciprofloxacin Hexal","Ciprofloxacin Krka","Ciprofloxacin Mylan","Ciprofloxacin Orion","Ciprofloxacin Ranbaxy","Ciprofloxacin Villerton","Ciproxin","Ciflox","Ciprofloxacin Accord","Ciprofloxacin MDS","Ciproxin"]},{"ATC": "J01MA06","kategori": "Norfloxacin","medel": ["Norfloxacin Krka"]},{"ATC": "J01MA12","kategori": "Levofloxacin","medel": ["Levofloxacin Bluefish","Levofloxacin Krka","Levofloxacin Mylan","Levofloxacin Orion","Quinsair","Tavanic"]},{"ATC": "J01MA14","kategori": "Moxifloxacin","medel": ["Avelox","Moxifloxacin Fresenius Kabi","Moxifloxacin Krka","Moxifloxacin Orion","Avelox"]},{"ATC": "J01XA01","kategori": "Vankomycin","medel": ["Vancomycin Actavis","Vancomycin Hospira","Vancomycin MIP","Vancomycin Mylan","Vancomycin Orion","Vancomycin Xellia"]},{"ATC": "J01XA02","kategori": "Teikoplanin","medel": ["Targocid","Teicoplanin Sandoz","Targocid"]},{"ATC": "J01XA04","kategori": "Dalbavancin","medel": ["Xydalba"]},{"ATC": "J01XB01","kategori": "Kolistin","medel": ["Colineb","Colobreathe","Tadim","Tadim"]},{"ATC": "J01XD01","kategori": "Metronidazol","medel": ["Metronidazole Braun"]},{"ATC": "J01XD02","kategori": "Tinidazol","medel": ["Fasigyn"]},{"ATC": "J01XE01","kategori": "Nitrofurantoin","medel": ["Furadantin","Nitrofurantoin Alternova"]},{"ATC": "J01XX01","kategori": "Fosfomycin","medel": ["Fosfomycin Infectopharm"]},{"ATC": "J01XX05","kategori": "Metenamin","medel": ["Hiprex"]},{"ATC": "J01XX08","kategori": "Linezolid","medel": ["Linezolid Accord","Linezolid Glenmark","Linezolid Krka","Linezolid Mylan","Linezolid Orion","Linezolid Reig Jofre","Linezolid Sandoz","Linezolid Teva","Zyvoxid","Zyvoxid"]},{"ATC": "J01XX09","kategori": "Daptomycin","medel": ["Cubicin"]},{"ATC": "J01XX11","kategori": "Tedizolid","medel": ["Sivextro"]},{"ATC": "J02AA01","kategori": "Amfotericin B","medel": ["AmBisome","Fungizone"]},{"ATC": "G01A","kategori": "","medel": ["Ecovag"]},{"ATC": "G01AA01","kategori": "Nystatin","medel": ["Nystimex"]},{"ATC": "G01AA03","kategori": "Amfotericin B","medel": ["AmBisome","Fungizone"]},{"ATC": "G01AA05","kategori": "Kloramfenikol","medel": ["Kloramfenikol CCS","Kloramfenikol Santen"]},{"ATC": "G01AA07","kategori": "Oxitetracyklin","medel": ["Terracortril med Polymyxin B","Terracortril","Terracortril med Polymyxin B"]},{"ATC": "G01AA10","kategori": "Klindamycin","medel": ["Dalacin"]},{"ATC": "G01AF01","kategori": "Metronidazol","medel": ["Flagyl","Zidoval"]},{"ATC": "G01AF02","kategori": "Klotrimazol","medel": ["Canesten"]},{"ATC": "G01AF05","kategori": "Ekonazol","medel": ["Pevaryl","Pevaryl Depot"]},{"ATC": "G01AC05","kategori": "Dekvalinium","medel": ["Donaxyl","Dequalinium Orifarm","Donaxyl"]},{"ATC": "D06AA03","kategori": "Oxitetracyklin","medel": ["Terracortril med Polymyxin B","Terracortril","Terracortril med Polymyxin B"]},{"ATC": "D06AA04","kategori": "Tetracyklin","medel": ["Tetracyklin Meda"]},{"ATC": "D06AX01","kategori": "Fusidinsyra","medel": ["Fucidin","Fucidine"]},{"ATC": "D06AX04","kategori": "Neomycin","medel": ["Mekostest","Betametason-neomycin i Essex kräm APL"]},{"ATC": "D06AX07","kategori": "Gentamicin","medel": ["Gensumycin","Gentamicin Ebb"]},{"ATC": "D06AX09","kategori": "Mupirocin","medel": ["Bactroban","Bactroban Nasal"]},{"ATC": "D06AX11","kategori": "Rifaximin","medel": ["Xifaxan"]},{"ATC": "D06AX13","kategori": "Retapamulin","medel": ["Altargo"]},{"ATC": "D06BB03","kategori": "Aciklovir","medel": ["Anti","Zovirax"]},{"ATC": "D06BB04","kategori": "Podofyllotoxin","medel": ["Wartec","Condylin","Condyline"]},{"ATC": "D06BB06","kategori": "Penciklovir","medel": ["Vectatone","Vectavir"]},{"ATC": "D06BB10","kategori": "Imikvimod","medel": ["ALDARA","Zyclara"]},{"ATC": "D06BB53","kategori": "Aciklovir, kombinationer","medel": ["Zoviduo"]},{"ATC": "D06BX01","kategori": "Metronidazol","medel": ["Rosazol","Rozex"]},{"ATC": "D06BX02","kategori": "Ingenolmebutat","medel": ["Picato"]},{"ATC": "R02AB30","kategori": "Gramicidin","medel": ["Bafucin","Bafucin Mint"]},{"ATC": "R02AB01","kategori": "Neomycin","medel": ["Mekostest","Betametason-neomycin i Essex kräm APL"]},{"ATC": "A07AA02","kategori": "Nystatin","medel": ["Nystimex"]},{"ATC": "A07AA09","kategori": "Vankomycin","medel": ["Vancocin","Vancomycin Xellia"]},{"ATC": "A07AA11","kategori": "Rifaximin","medel": ["Xifaxan"]},{"ATC": "A07AA12","kategori": "Fidaxomicin","medel": ["DIFICLIR"]},{"ATC": "J04AB04","kategori": "Rifabutin","medel": ["Ansatipin"]},{"ATC": "J04AB01","kategori": "Cykloserin","medel": ["Rifadin","Rimactan","Rifampicin Ebb","Rifampicin Orifarm","Rimactan"]},{"ATC": "A02BD06","kategori": "Esomeprazol, amoxicillin och klaritromycin","medel": ["Nexium HP"]},{"ATC": "L01AA01","kategori": "Cyklofosfamid","medel": ["Sendoxan"]},{"ATC": "L01AA02","kategori": "Klorambucil","medel": ["Leukeran"]},{"ATC": "L01AA03","kategori": "Melfalan\tAlkeran","medel": ["Alkéran"]},{"ATC": "L01AA06","kategori": "Ifosfamid","medel": ["Holoxan"]},{"ATC": "L01AA09","kategori": "Bendamustin","medel": ["Bendamustin Actavis","Bendamustine Accord","Bendamustine medac","Ribovact"]},{"ATC": "L01AB01","kategori": "Busulfan","medel": ["Busilvex","Myleran"]},{"ATC": "L01AC01","kategori": "Tiotepa","medel": ["TEPADINA"]},{"ATC": "L01AD02","kategori": "Lomustin","medel": ["Lomustine Medac"]},{"ATC": "L01AX03","kategori": "Temozolomid","medel": ["Temozolomide Accord","Temozolomide Sandoz","Temozolomide SUN","Temozolomide Teva","Temozolomid STADA","Temodal","Temomedac"]},{"ATC": "L01AX04","kategori": "Dakarbazin","medel": ["Dacarbazine medac"]},{"ATC": "L01BA01","kategori": "Metotrexat","medel": ["Methotrexate Ebewe","Methotrexate Pfizer","Methotrexate Teva"]},{"ATC": "L01BA04","kategori": "Pemetrexed","medel": ["ALIMTA","Armisarte"]},{"ATC": "L01BB02","kategori": "Merkaptopurin","medel": ["Puri-nethol","Xaluprine","Puri-nethol","Purinethol"]},{"ATC": "L01BB03","kategori": "Tioguanin","medel": ["Lanvis"]},{"ATC": "L01BB04","kategori": "Kladribin","medel": ["Litak"]},{"ATC": "L01BB05","kategori": "Fludarabin","medel": ["Fludara","Fludarabin Actavis","Fludarabin Ebewe","Fludarabine Accord","Fludara"]},{"ATC": "L01BB06","kategori": "Klofarabin","medel": ["Evoltra"]},{"ATC": "L01BB07","kategori": "Nelarabin","medel": ["ATRIANCE"]},{"ATC": "L01BC01","kategori": "Cytarabin","medel": ["Cytarabin Fresenius Kabi","Cytarabin Hikma","Cytarabine Accord","Cytarabine Pfizer"]},{"ATC": "L01BC02","kategori": "Fluorouracil","medel": ["Fluorouracil Accord","Fluorouracil Teva"]},{"ATC": "L01BC03","kategori": "Tegafur","medel": ["Teysuno"]},{"ATC": "L01BC05","kategori": "Gemcitabin","medel": ["Gemcitabin Hospira","Gemcitabin Sandoz","Gemcitabine Accord","Gemkabi","Gemzar","Gitrabin"]},{"ATC": "L01BC06","kategori": "Kapecitabin","medel": ["Capecitabin STADA","Capecitabine Accord","Capecitabine Orion","Capecitabine Sandoz","Xeloda"]},{"ATC": "L01BC07","kategori": "Azacitidin","medel": ["Vidaza"]},{"ATC": "L01BC08","kategori": "Decitabin","medel": ["DACOGEN"]},{"ATC": "L01BC52","kategori": "Fluorouracil, kombinationer","medel": ["Actikerall"]},{"ATC": "L01BC53","kategori": "Tegafur, kombinationer","medel": ["Teysuno"]},{"ATC": "L01BC59","kategori": "Trifluridin, kombinationer","medel": ["Lonsurf"]},{"ATC": "L01CA01","kategori": "Vinblastin","medel": ["Velbe"]},{"ATC": "L01CA02","kategori": "Vinkristin","medel": ["Oncovin","Vincristine Hospira"]},{"ATC": "L01CA03","kategori": "Vindesin","medel": ["Eldisine"]},{"ATC": "L01CA04","kategori": "Vinorelbin","medel": ["Navelbine","Navirel","Vinorelbin Actavis","Vinorelbin Ebewe","Navelbine"]},{"ATC": "L01CA05","kategori": "Vinflunin","medel": ["Javlor"]},{"ATC": "L01CB01","kategori": "Etoposid","medel": ["Eposin","Etopofos","Etoposid Ebewe","Etoposid Fresenius Kabi","Etoposide Accord","Vepesid","Vepesid"]},{"ATC": "L01CD01","kategori": "Paklitaxel","medel": ["Abraxane","Pacligen","Paclitaxel Accord","Paclitaxel Actavis","Paclitaxel Fresenius Kabi","Paclitaxel Hospira"]},{"ATC": "L01CD02","kategori": "Docetaxel","medel": ["Docetaxel Accord","Docetaxel Actavis","Docetaxel Amring","Docetaxel Ebewe","Docetaxel Hospira","DOCETAXEL KABI","TAXOTERE"]},{"ATC": "L01CD04","kategori": "Cabazitaxel","medel": ["JEVTANA"]},{"ATC": "L01CX01","kategori": "Trabektedin","medel": ["Yondelis"]},{"ATC": "L01DB01","kategori": "Doxorubicin","medel": ["Caelyx","Doxorubicin Accord","Doxorubicin Actavis","Doxorubicin Ebewe","Doxorubicin Teva","Myocet"]},{"ATC": "L01DB02","kategori": "Daunorubicin","medel": ["Cerubidin","Cerubidine"]},{"ATC": "L01DB03","kategori": "Epirubicin","medel": ["Epirubicin Accord","Epirubicin Actavis","Epirubicin Ebewe","Epirubicin Teva"]},{"ATC": "L01DB06","kategori": "Idarubicin","medel": ["Idarubicin Accord","Zavedos"]},{"ATC": "L01DB07","kategori": "Mitoxantron","medel": ["Mitoxantron Ebewe","Novantrone"]},{"ATC": "L01DB11","kategori": "Pixantron","medel": ["Pixuvri"]},{"ATC": "L01DC01","kategori": "Bleomycin","medel": ["Bleomycin Baxter"]},{"ATC": "L01DC03","kategori": "Mitomycin","medel": ["Mitomycin medac"]},{"ATC": "L01XA01","kategori": "Cisplatin","medel": ["Cisplatin Accord","Cisplatin Ebewe","Cisplatin Hospira"]},{"ATC": "L01XA02","kategori": "Karboplatin","medel": ["Carboplatin Accord","Carboplatin Actavis","Carboplatin Ebewe","Carboplatin Hospira","Carboplatin Teva"]},{"ATC": "L01XA03","kategori": "Oxaliplatin","medel": ["Oxaliplatin Accord","Oxaliplatin Fresenius Kabi","Oxaliplatin Hospira","Oxaliplatin SUN","Oxaliplatin Teva"]},{"ATC": "L01XB02","kategori": "Dakarbazin","medel": ["Dacarbazine medac"]},{"ATC": "L01XC","kategori": "","medel": ["Tecentriq"]},{"ATC": "L01XC02","kategori": "Rituximab","medel": ["MabThera","Ritemvia"]},{"ATC": "L01XC03","kategori": "Trastuzumab","medel": ["Herceptin"]},{"ATC": "L01XC04","kategori": "Alemtuzumab","medel": ["Lemtrada"]},{"ATC": "L01XC06","kategori": "Cetuximab","medel": ["Erbitux"]},{"ATC": "L01XC07","kategori": "Bevacizumab","medel": ["Avastin"]},{"ATC": "L01XC08","kategori": "Panitumumab","medel": ["Vectibix"]},{"ATC": "L01XC10","kategori": "Ofatumumab","medel": ["Arzerra"]},{"ATC": "L01XC11","kategori": "Ipilimumab","medel": ["YERVOY"]},{"ATC": "L01XC12","kategori": "Brentuximabvedotin","medel": ["ADCETRIS"]},{"ATC": "L01XC13","kategori": "Pertuzumab","medel": ["Perjeta"]},{"ATC": "L01XC14","kategori": "Trastuzumabemtansin","medel": ["Kadcyla"]},{"ATC": "L01XC15","kategori": "Obinutuzumab","medel": ["Gazyvaro"]},{"ATC": "L01XC17","kategori": "Nivolumab","medel": ["OPDIVO"]},{"ATC": "L01XC18","kategori": "Pembrolizumab","medel": ["KEYTRUDA"]},{"ATC": "L01XC19","kategori": "Blinatumomab","medel": ["BLINCYTO"]},{"ATC": "L01XC21","kategori": "Ramucirumab","medel": ["Cyramza"]},{"ATC": "L01XC23","kategori": "Elotuzumab","medel": ["Empliciti"]},{"ATC": "L01XC24","kategori": "Daratumumab","medel": ["DARZALEX"]},{"ATC": "L01XC26","kategori": "Inotuzumabozogamicin","medel": ["BESPONSA"]},{"ATC": "L01XC27","kategori": "Olaratumab","medel": ["Lartruvo"]},{"ATC": "L01XC31","kategori": "Avelumab","medel": ["Bavencio"]},{"ATC": "L01XD03","kategori": "Metylaminolevulinat","medel": ["Metvix","Metvix"]},{"ATC": "L01XD04","kategori": "Aminolevulinsyra","medel": ["Alacare","Ameluz","Gliolan"]},{"ATC": "L01XE01","kategori": "Imatinib","medel": ["Glivec","Imatinib Accord","Imatinib Krka d.d.","Imatinib Mylan","Imatinib Sandoz","Imatinib STADA","Imatinib Teva"]},{"ATC": "L01XE02","kategori": "Gefitinib","medel": ["IRESSA"]},{"ATC": "L01XE03","kategori": "Erlotinib","medel": ["Tarceva"]},{"ATC": "L01XE04","kategori": "Sunitinib","medel": ["SUTENT"]},{"ATC": "L01XE05","kategori": "Sorafenib","medel": ["Nexavar"]},{"ATC": "L01XE06","kategori": "Dasatinib","medel": ["Sprycel"]},{"ATC": "L01XE07","kategori": "Lapatinib","medel": ["Tyverb"]},{"ATC": "L01XE08","kategori": "Nilotinib","medel": ["Tasigna"]},{"ATC": "L01XE09","kategori": "Temsirolimus","medel": ["Torisel"]},{"ATC": "L01XE10","kategori": "Everolimus","medel": ["Afinitor","Votubia"]},{"ATC": "L01XE11","kategori": "Pazopanib","medel": ["Votrient"]},{"ATC": "L01XE12","kategori": "Vandetanib","medel": ["Caprelsa"]},{"ATC": "L01XE13","kategori": "Afatinib","medel": ["GIOTRIF"]},{"ATC": "L01XE14","kategori": "Bosutinib","medel": ["Bosulif"]},{"ATC": "L01XE15","kategori": "Vemurafenib","medel": ["Zelboraf"]},{"ATC": "L01XE16","kategori": "Krizotinib","medel": ["XALKORI"]},{"ATC": "L01XE17","kategori": "Axitinib","medel": ["Inlyta"]},{"ATC": "L01XE18","kategori": "Ruxolitinib","medel": ["Jakavi"]},{"ATC": "L01XE21","kategori": "Regorafenib","medel": ["Stivarga"]},{"ATC": "L01XE23","kategori": "Dabrafenib","medel": ["TAFINLAR"]},{"ATC": "L01XE24","kategori": "Ponatinib","medel": ["Iclusig"]},{"ATC": "L01XE25","kategori": "Trametinib","medel": ["Mekinist"]},{"ATC": "L01XE26","kategori": "Kabozantinib","medel": ["CABOMETYX","Cometriq"]},{"ATC": "L01XE27","kategori": "Ibrutinib","medel": ["IMBRUVICA"]},{"ATC": "L01XE28","kategori": "Ceritinib","medel": ["Zykadia"]},{"ATC": "L01XE29","kategori": "Lenvatinib","medel": ["Kisplyx","LENVIMA"]},{"ATC": "L01XE31","kategori": "Nintedanib","medel": ["Ofev","Vargatef"]},{"ATC": "L01XE33","kategori": "Palbociklib","medel": ["IBRANCE"]},{"ATC": "L01XE35","kategori": "Osimertinib","medel": ["TAGRISSO"]},{"ATC": "L01XE36","kategori": "Alektinib","medel": ["Alecensa"]},{"ATC": "L01XE38","kategori": "Kobimetinib","medel": ["Cotellic"]},{"ATC": "L01XE39","kategori": "Midostaurin","medel": ["Rydapt"]},{"ATC": "L01XE42","kategori": "Ribociklib","medel": ["Kisqali"]},{"ATC": "L01XX01","kategori": "Amsakrin","medel": ["Amekrin"]},{"ATC": "L01XX05","kategori": "Hydroxikarbamid","medel": ["Hydrea","Hydroxyurea medac","Hydroxikarbamid Orifarm","Hydrea"]},{"ATC": "L01XX06","kategori": "BCG-vaccin","medel": ["BCG-vaccin AJVaccines"]},{"ATC": "L01XX11","kategori": "Estramustin","medel": ["Estracyt (Estramustin-17-fosfat)","Estracyt (Estramustin-17-fosfat)"]},{"ATC": "L01XX14","kategori": "Tretinoin","medel": ["Acnatac","Acnatac"]},{"ATC": "L01XX17","kategori": "Topotekan","medel": ["Hycamtin","Potactasol","Topotecan Accord","Topotecan Ebewe"]},{"ATC": "L01XX19","kategori": "Irinotekan","medel": ["Irinokabi","Irinotecan Accord","Irinotecan Actavis","Irinotecan Hospira","ONIVYDE"]},{"ATC": "L01XX23","kategori": "Mitotan","medel": ["Lysodren"]},{"ATC": "L01XX24","kategori": "Pegaspargas","medel": ["Oncaspar"]},{"ATC": "L01XX25","kategori": "Bexaroten","medel": ["Targretin"]},{"ATC": "L01XX26","kategori": "Verteporfin","medel": ["Visudyne"]},{"ATC": "L01XX27","kategori": "Arseniktrioxid","medel": ["TRISENOX"]},{"ATC": "L01XX32","kategori": "Bortezomib","medel": ["VELCADE"]},{"ATC": "L01XX33","kategori": "Celecoxib","medel": ["Celecoxib Krka","Celecoxib Orion","Celecoxib Sandoz","Celecoxib STADA","Celebra","Celecoxib 2care4"]},{"ATC": "L01XX35","kategori": "Anagrelid","medel": ["Anagrelid Avansor","Anagrelide Sandoz","Xagrid"]},{"ATC": "L01XX41","kategori": "Eribulin","medel": ["HALAVEN"]},{"ATC": "L01XX42","kategori": "Panobinostat","medel": ["Farydak"]},{"ATC": "L01XX43","kategori": "Vismodegib","medel": ["Erivedge"]},{"ATC": "L01XX44","kategori": "Aflibercept","medel": ["ZALTRAP"]},{"ATC": "L01XX45","kategori": "Karfilzomib","medel": ["Kyprolis"]},{"ATC": "L01XX46","kategori": "Olaparib","medel": ["Lynparza"]},{"ATC": "L01XX47","kategori": "Idelalisib","medel": ["Zydelig"]},{"ATC": "L01XX51","kategori": "Talimogen laherparepvek","medel": ["Imlygic"]},{"ATC": "L01XX52","kategori": "Venetoklax","medel": ["Venclyxto"]},{"ATC": "D07AA02","kategori": "Hydrokortison","medel": ["Ficortril","Hydrokortison CCS","Mildison Lipid"]},{"ATC": "D07AB01","kategori": "Klobetason","medel": ["Emovat"]},{"ATC": "D07AB02","kategori": "Hydrokortisonbutyrat","medel": ["Locoid","Locoid Crelo","Locoid Lipid"]},{"ATC": "D07AC01","kategori": "Betametason","medel": ["Betametason CCS","Betnovat","Bettamousse","Diproderm","Betnovat","Betnovate"]},{"ATC": "D07AC05","kategori": "Fluokortolon","medel": ["Synalar"]},{"ATC": "D07AC17","kategori": "Flutikason","medel": ["Flutivate"]},{"ATC": "D07AC13","kategori": "Mometason","medel": ["Demoson","Elocon","Mometason Glenmark","Ovixan"]},{"ATC": "D07AD01","kategori": "Klobetasol","medel": ["Clobex","Dermovat","Dermovat","Dermovate"]},{"ATC": "D07BC01","kategori": "Betametason och antiseptika","medel": ["Betnovat med chinoform"]},{"ATC": "D07CA01","kategori": "Hydrokortison och antibiotika","medel": ["Fucidin-Hydrocortison","Terracortril","Fucidin-Hydrocortison","Fusidinsyra/Hydrokortison 2care4"]},{"ATC": "D07CC01","kategori": "","medel": ["Fusidinsyra/Betametason LEO"]},{"ATC": "D07XA01","kategori": "Hydrokortison","medel": ["Fenuril-Hydrokortison"]},{"ATC": "D07XC01","kategori": "Betametason","medel": ["Diprosalic","Diprosalic"]},{"ATC": "D01BA02","kategori": "Terbinafin","medel": ["Terbinafin Actavis","Terbinafin Bluefish","Terbinafin Hexal","Terbinafin Medical Valley","Terbinafin Orifarm"]},{"ATC": "H02AA02","kategori": "Fludrokortison","medel": ["Florinef"]},{"ATC": "H02AB01","kategori": "Betametason","medel": ["Betametason Alternova","Betapred","Celeston bifas"]},{"ATC": "H02AB02","kategori": "Dexametason","medel": ["Dexametason Abcur","Dexamethasone Krka","Neofordex"]},{"ATC": "H02AB04","kategori": "Metylprednisolon","medel": ["Depo-Medrol","Depo-Medrol cum lidocain","Medrol","Methylprednisolone Orion","Solu-Medrol","Depo-Medrol","Depo-Medrol cum lidocain","Metylprednisolon Ebb","Solu-Medrol"]},{"ATC": "H02AB06","kategori": "Prednisolon","medel": ["Precortalon aquosum","Prednisolon Actavis","Prednisolon Alternova","Prednisolon Pfizer","Prednisolon Pilum","Prednisolon Ebb"]},{"ATC": "H02AB07","kategori": "Prednison","medel": ["Deltison"]},{"ATC": "H02AB08","kategori": "Triamcinolon","medel": ["Kenacort-T","Lederspan","Trica","Lederlon","Lederspan"]},{"ATC": "H02AB09","kategori": "Hydrokortison","medel": ["Hydrokortison Orifarm","Hydrokortison Orion","Hydrokortison Takeda","Plenadren","Solu-Cortef","Solu-Cortef"]},{"ATC": "L04AA02","kategori": "Muromonab CD3","medel": ["CellCept","Mycophenolate mofetil Accord","Mycophenolate mofetil Sandoz","Myfenax","Myfortic","Mykofenolatmofetil Accord","Mykofenolatmofetil Actavis","Mycophenolate mofetil Accord","Mycophenolate mofetil Cross Pharma","Mycophenolate mofetil Sandoz","Mykofenolatmofetil 2care4","Mykofenolatmofetil Actavis","Mykofenolatmofetil Orifarm"]},{"ATC": "L04AA04","kategori": "Anti-tymocyt-immunoglobulin (kanin)","medel": ["Grafalon","Thymoglobuline"]},{"ATC": "L04AA06","kategori": "Mykofenolsyra","medel": ["CellCept","Mycophenolate mofetil Accord","Mycophenolate mofetil Sandoz","Myfenax","Myfortic","Mykofenolatmofetil Accord","Mykofenolatmofetil Actavis","Mycophenolate mofetil Accord","Mycophenolate mofetil Cross Pharma","Mycophenolate mofetil Sandoz","Mykofenolatmofetil 2care4","Mykofenolatmofetil Actavis","Mykofenolatmofetil Orifarm"]},{"ATC": "L04AA10","kategori": "Sirolimus","medel": ["Rapamune"]},{"ATC": "L04AA13","kategori": "Leflunomid","medel": ["Arava","Leflunomid Bluefish","Leflunomide medac"]},{"ATC": "L04AA18","kategori": "Everolimus","medel": ["Certican","Certican"]},{"ATC": "L04AA23","kategori": "Natalizumab","medel": ["Tysabri"]},{"ATC": "L04AA24","kategori": "Abatacept","medel": ["ORENCIA"]},{"ATC": "L04AA25","kategori": "Eculizumab","medel": ["Soliris"]},{"ATC": "L04AA26","kategori": "Belimumab","medel": ["Benlysta"]},{"ATC": "L04AA27","kategori": "Fingolimod","medel": ["GILENYA"]},{"ATC": "L04AA28","kategori": "Belatacept","medel": ["NULOJIX"]},{"ATC": "L04AA29","kategori": "Tofacitinib","medel": ["XELJANZ"]},{"ATC": "L04AA31","kategori": "Teriflunomid","medel": ["AUBAGIO"]},{"ATC": "L04AA32","kategori": "Apremilast","medel": ["Otezla"]},{"ATC": "L04AA33","kategori": "Vedolizumab","medel": ["Entyvio"]},{"ATC": "L04AA34","kategori": "Alemtuzumab","medel": ["Lemtrada"]},{"ATC": "L04AA36","kategori": "Okrelizumab","medel": ["Ocrevus"]},{"ATC": "L04AA40","kategori": "Kladribin","medel": ["MAVENCLAD"]}];

function tempAtcParser(str) {
    var lines = str.split(/[\n\r]+/).map(function(line) {
        return line.trimRight();
    });

    var allGroups = [];
    var group;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        if (line.length === 0) continue;
        if (line[0] === '\t') {
            // Medicine
            if (!group) continue;

            group.medel.push(line.trim());
        } else {
            // Group name
            if (group && group.medel.length > 0)
                allGroups.push(group);

            var atc = /^([A-Z0-9]+)\s*(.*?)$/.exec(line);
            if (!atc) throw new Error(line);
            group = {
                ATC: atc[1],
                kategori: atc[2],
                medel: []
            };
        }
    }

    if (group && group.medel.length > 0)
        allGroups.push(group);

    return allGroups;
}
