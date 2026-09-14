import React, { useState, useEffect } from "react";
import {
  setUserData,
  getUserData,
  setCompanyData,
  logout,
  setIdValidation,
} from "../../services/AuthService";
import { registerUserService } from "../../services/HTTPService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as appData from "../../config.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validations } from "../../services/ValidationService";

import Colors from "../../assets/theme/Colors";
export default function SignUp(props) {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    city: "",
  });
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    if (loading === true) {
      setLoading(false);
      if (Object.keys(getUserData()).length > 0) {
        navigate(`/dashboard`);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  });

  return (
    <div className="border-top-wide border-primary d-flex flex-column">
      <div className="page page-center">
        <div className="container-tight py-4" style={{ maxWidth: "30rem" }}>
          <div className="text-center mb-4">
            <a href="." className="navbar-brand navbar-brand-autodark">
              <img src={appData.appLogo} alt={appData.appTitle} height={75} />
            </a>
          </div>
          <div className="card card-md">
            <div className="card-body">
              <h1
                className="text-center mb-4"
                style={{ color: Colors.defaultThemeColor }}
              >
                New Registration
              </h1>
              <div className="mb-3">
                <label className="form-label">
                  First Name <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={payload.firstName}
                  onChange={(e) => {
                    let val = e.target.value;
                    setPayload({ ...payload, firstName: val });
                  }}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={payload.lastName}
                  onChange={(e) => {
                    let val = e.target.value;
                    setPayload({ ...payload, lastName: val });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Email <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  autoComplete={"off"}
                  value={payload.email}
                  onChange={(e) => {
                    let val = e.target.value;
                    setPayload({ ...payload, email: val });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Date of Birth <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={payload.dob}
                  placeholder="Date of Birth"
                  autoComplete="off"
                  onChange={(e) => {
                    let val = e.target.value;
                    setPayload({ ...payload, dob: val });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Password <span style={{ color: "red" }}> *</span>
                </label>
                <div className="input-group input-group-flat">
                  <input
                    type={isPwdVisible === false ? "password" : "text"}
                    className="form-control"
                    placeholder="Password"
                    autoComplete="off"
                    value={payload.password}
                    onChange={(e) => {
                      let val = e.target.value;
                      setPayload({ ...payload, password: val });
                    }}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => {
                      setIsPwdVisible((prev) => !prev);
                    }}
                  >
                    {isPwdVisible === true ? (
                      <FaEye size={18} />
                    ) : (
                      <FaEyeSlash size={18} />
                    )}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">City</label>
                <div className="input-group input-group-flat">
                  <select
                    className="form-select"
                    value={payload.city}
                    onChange={(e) => {
                      let val = e.target.value;
                      setPayload({ ...payload, city: val });
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Addison">Addison</option>
                    <option value="Ahmic harbour">Ahmic harbour</option>
                    <option value="Ailsa craig">Ailsa craig</option>
                    <option value="Ajax">Ajax</option>
                    <option value="Akwesasne">Akwesasne</option>
                    <option value="Alban">Alban</option>
                    <option value="Alberton">Alberton</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Alfred">Alfred</option>
                    <option value="Algoma mills">Algoma mills</option>
                    <option value="Algonquin highlands">
                      Algonquin highlands
                    </option>
                    <option value="Alisa Craig">Alisa Craig</option>
                    <option value="Allanburg">Allanburg</option>
                    <option value="Allenford">Allenford</option>
                    <option value="Alliston">Alliston</option>
                    <option value="Alma">Alma</option>
                    <option value="Almonte">Almonte</option>
                    <option value="Alton">Alton</option>
                    <option value="Alvinston">Alvinston</option>
                    <option value="Amaranth">Amaranth</option>
                    <option value="Ameliasburg">Ameliasburg</option>
                    <option value="Amherstburg">Amherstburg</option>
                    <option value="Amherstview">Amherstview</option>
                    <option value="Ancaster">Ancaster</option>
                    <option value="Angling lake">Angling lake</option>
                    <option value="Angus">Angus</option>
                    <option value="Annan">Annan</option>
                    <option value="Appin">Appin</option>
                    <option value="Apple Hill">Apple Hill</option>
                    <option value="Apsley">Apsley</option>
                    <option value="Arden">Arden</option>
                    <option value="Ardoch">Ardoch</option>
                    <option value="Ariss">Ariss</option>
                    <option value="Arkell">Arkell</option>
                    <option value="Arkona">Arkona</option>
                    <option value="Armstrong Station">Armstrong Station</option>
                    <option value="Arnprior">Arnprior</option>
                    <option value="Arnstein">Arnstein</option>
                    <option value="Aroland">Aroland</option>
                    <option value="Arthur">Arthur</option>
                    <option value="Arva">Arva</option>
                    <option value="Ashburn">Ashburn</option>
                    <option value="Ashton">Ashton</option>
                    <option value="Asphodel Norwood">Asphodel Norwood</option>
                    <option value="Asphodel-norwood">Asphodel-norwood</option>
                    <option value="Astorville">Astorville</option>
                    <option value="Astra">Astra</option>
                    <option value="Athens">Athens</option>
                    <option value="Atikokan">Atikokan</option>
                    <option value="Attawapiskat">Attawapiskat</option>
                    <option value="Atwood">Atwood</option>
                    <option value="Auburn">Auburn</option>
                    <option value="Augusta">Augusta</option>
                    <option value="Aurora">Aurora</option>
                    <option value="Avonmore">Avonmore</option>
                    <option value="Aweres TWP">Aweres TWP</option>
                    <option value="Aylmer">Aylmer</option>
                    <option value="Ayr">Ayr</option>
                    <option value="Ayton">Ayton</option>
                    <option value="Azidala">Azidala</option>
                    <option value="Azilda">Azilda</option>
                    <option value="Baden">Baden</option>
                    <option value="Badjeros">Badjeros</option>
                    <option value="Bailieboro">Bailieboro</option>
                    <option value="Bainsville">Bainsville</option>
                    <option value="Bala">Bala</option>
                    <option value="Balderson">Balderson</option>
                    <option value="Baldwin">Baldwin</option>
                    <option value="Ballinafad">Ballinafad</option>
                    <option value="Balmertown">Balmertown</option>
                    <option value="Baltimore">Baltimore</option>
                    <option value="Bancroft">Bancroft</option>
                    <option value="Barrhaven">Barrhaven</option>
                    <option value="Barrie">Barrie</option>
                    <option value="Barrys Bay">Barrys Bay</option>
                    <option value="Barwick">Barwick</option>
                    <option value="Batawa">Batawa</option>
                    <option value="Batchawana bay">Batchawana bay</option>
                    <option value="Batchewana First Nation">
                      Batchewana First Nation
                    </option>
                    <option value="Bath">Bath</option>
                    <option value="Battersea">Battersea</option>
                    <option value="Bayfield">Bayfield</option>
                    <option value="Baysville">Baysville</option>
                    <option value="Beachburg">Beachburg</option>
                    <option value="Beachville">Beachville</option>
                    <option value="Beamsville">Beamsville</option>
                    <option value="Bear island">Bear island</option>
                    <option value="Beardmore">Beardmore</option>
                    <option value="Bearskin lake">Bearskin lake</option>
                    <option value="Beaumaris">Beaumaris</option>
                    <option value="Beaverton">Beaverton</option>
                    <option value="Beeton">Beeton</option>
                    <option value="Belfountain">Belfountain</option>
                    <option value="Belgrave">Belgrave</option>
                    <option value="Belle ewart">Belle ewart</option>
                    <option value="Belle River">Belle River</option>
                    <option value="Belle Vallee">Belle Vallee</option>
                    <option value="Belleville">Belleville</option>
                    <option value="Belmont">Belmont</option>
                    <option value="Belwood">Belwood</option>
                    <option value="Berkeley">Berkeley</option>
                    <option value="Berwick">Berwick</option>
                    <option value="Bethany">Bethany</option>
                    <option value="Bewdley">Bewdley</option>
                    <option value="Big trout lake">Big trout lake</option>
                    <option value="Binbrook">Binbrook</option>
                    <option value="Birch island">Birch island</option>
                    <option value="Biscotasing">Biscotasing</option>
                    <option value="Bisset Creek">Bisset Creek</option>
                    <option value="Bissett creek">Bissett creek</option>
                    <option value="Blackstock">Blackstock</option>
                    <option value="Blenheim">Blenheim</option>
                    <option value="Blenhein">Blenhein</option>
                    <option value="Blezard Valley">Blezard Valley</option>
                    <option value="Blind River">Blind River</option>
                    <option value="Bloomfield">Bloomfield</option>
                    <option value="Bloomingdale">Bloomingdale</option>
                    <option value="Blue Mountains">Blue Mountains</option>
                    <option value="Bluevale">Bluevale</option>
                    <option value="Blyth">Blyth</option>
                    <option value="Bobcaygeon">Bobcaygeon</option>
                    <option value="Bognor">Bognor</option>
                    <option value="Bolsover">Bolsover</option>
                    <option value="Bolton">Bolton</option>
                    <option value="Bond head">Bond head</option>
                    <option value="Bonfield">Bonfield</option>
                    <option value="Borden">Borden</option>
                    <option value="Bornholm">Bornholm</option>
                    <option value="Bothwell">Bothwell</option>
                    <option value="Boulter">Boulter</option>
                    <option value="Bourget">Bourget</option>
                    <option value="Bowmanville">Bowmanville</option>
                    <option value="Bracebridge">Bracebridge</option>
                    <option value="Bradford">Bradford</option>
                    <option value="Braeside">Braeside</option>
                    <option value="Brampton">Brampton</option>
                    <option value="Branchton">Branchton</option>
                    <option value="Brant ">Brant </option>
                    <option value="Brantford">Brantford</option>
                    <option value="Brechin">Brechin</option>
                    <option value="Breslau">Breslau</option>
                    <option value="Bridgden">Bridgden</option>
                    <option value="Bridgenorth">Bridgenorth</option>
                    <option value="Brigden">Brigden</option>
                    <option value="Bright">Bright</option>
                    <option value="Bright's Grove">Bright's Grove</option>
                    <option value="Brighton">Brighton</option>
                    <option value="Brinston">Brinston</option>
                    <option value="Britt">Britt</option>
                    <option value="Brock">Brock</option>
                    <option value="Brockton">Brockton</option>
                    <option value="Brockville">Brockville</option>
                    <option value="Brodhagen">Brodhagen</option>
                    <option value="Brougham">Brougham</option>
                    <option value="Brownsville">Brownsville</option>
                    <option value="Bruce Mines">Bruce Mines</option>
                    <option value="Brucefield">Brucefield</option>
                    <option value="Brunner">Brunner</option>
                    <option value="Brussels">Brussels</option>
                    <option value="Buckhorn">Buckhorn</option>
                    <option value="Burford">Burford</option>
                    <option value="Burgessville">Burgessville</option>
                    <option value="Burgesville">Burgesville</option>
                    <option value="Burks Falls">Burks Falls</option>
                    <option value="Burlington">Burlington</option>
                    <option value="Burnstown">Burnstown</option>
                    <option value="Burnt River">Burnt River</option>
                    <option value="Burritts rapids">Burritts rapids</option>
                    <option value="Byng Inlet">Byng Inlet</option>
                    <option value="Cache Bay">Cache Bay</option>
                    <option value="Caesarea">Caesarea</option>
                    <option value="Caistor Centre">Caistor Centre</option>
                    <option value="Calabogie">Calabogie</option>
                    <option value="Caledon">Caledon</option>
                    <option value="Caledon East">Caledon East</option>
                    <option value="Caledon Village">Caledon Village</option>
                    <option value="Caledonia">Caledonia</option>
                    <option value="Callander">Callander</option>
                    <option value="Cambray">Cambray</option>
                    <option value="Cambridge">Cambridge</option>
                    <option value="Camden east">Camden east</option>
                    <option value="Cameron">Cameron</option>
                    <option value="Camlachie">Camlachie</option>
                    <option value="Campbellcroft">Campbellcroft</option>
                    <option value="Campbelleville">Campbelleville</option>
                    <option value="Campbellford">Campbellford</option>
                    <option value="Campbellville">Campbellville</option>
                    <option value="Campden">Campden</option>
                    <option value="Canfield">Canfield</option>
                    <option value="Cannifton">Cannifton</option>
                    <option value="Cannington">Cannington</option>
                    <option value="Capreol">Capreol</option>
                    <option value="Caramat">Caramat</option>
                    <option value="Cardiff">Cardiff</option>
                    <option value="Cardinal">Cardinal</option>
                    <option value="Cargill">Cargill</option>
                    <option value="Carleton Place">Carleton Place</option>
                    <option value="Carlisle">Carlisle</option>
                    <option value="Carlsbad Springs">Carlsbad Springs</option>
                    <option value="Carp">Carp</option>
                    <option value="Carrying Place">Carrying Place</option>
                    <option value="Cartier">Cartier</option>
                    <option value="Casselman">Casselman</option>
                    <option value="Castleton">Castleton</option>
                    <option value="Cat lake">Cat lake</option>
                    <option value="Cathcart">Cathcart</option>
                    <option value="Cavan">Cavan</option>
                    <option value="Cavan Monaghan">Cavan Monaghan</option>
                    <option value="Cayuga">Cayuga</option>
                    <option value="Cedar Springs">Cedar Springs</option>
                    <option value="Cedar Valley">Cedar Valley</option>
                    <option value="Centralia">Centralia</option>
                    <option value="Centreville">Centreville</option>
                    <option value="Chalk River">Chalk River</option>
                    <option value="Chapleau">Chapleau</option>
                    <option value="Chaput hughes">Chaput hughes</option>
                    <option value="Charing Cross">Charing Cross</option>
                    <option value="Charlton">Charlton</option>
                    <option value="Chatham">Chatham</option>
                    <option value="Chatsworth">Chatsworth</option>
                    <option value="Chelmsford">Chelmsford</option>
                    <option value="Cheltenham">Cheltenham</option>
                    <option value="Chepstow">Chepstow</option>
                    <option value="Cherry Valley">Cherry Valley</option>
                    <option value="Chesley">Chesley</option>
                    <option value="Chesterville">Chesterville</option>
                    <option value="Christian Island">Christian Island</option>
                    <option value="Churchill">Churchill</option>
                    <option value="Chute a Blondeau">Chute a Blondeau</option>
                    <option value="Claremont">Claremont</option>
                    <option value="Clarence Creek">Clarence Creek</option>
                    <option value="Clarendon Station">Clarendon Station</option>
                    <option value="Clarington ">Clarington </option>
                    <option value="Clarksburg">Clarksburg</option>
                    <option value="Clayton">Clayton</option>
                    <option value="Clear Creek">Clear Creek</option>
                    <option value="Clearwater bay">Clearwater bay</option>
                    <option value="Clifford">Clifford</option>
                    <option value="Clinton">Clinton</option>
                    <option value="Cloyne">Cloyne</option>
                    <option value="Coatsworth Station">
                      Coatsworth Station
                    </option>
                    <option value="Cobalt">Cobalt</option>
                    <option value="Cobden">Cobden</option>
                    <option value="Coboconk">Coboconk</option>
                    <option value="Cobourg">Cobourg</option>
                    <option value="Cochenour">Cochenour</option>
                    <option value="Cochrane">Cochrane</option>
                    <option value="Codrington">Codrington</option>
                    <option value="Coe Hill">Coe Hill</option>
                    <option value="Colborne">Colborne</option>
                    <option value="Coldwater">Coldwater</option>
                    <option value="Collingwood">Collingwood</option>
                    <option value="Collins">Collins</option>
                    <option value="Comber">Comber</option>
                    <option value="Combermere">Combermere</option>
                    <option value="Commanda">Commanda</option>
                    <option value="Concord">Concord</option>
                    <option value="Conestogo">Conestogo</option>
                    <option value="Coniston">Coniston</option>
                    <option value="Conn">Conn</option>
                    <option value="Connaught">Connaught</option>
                    <option value="Consecon">Consecon</option>
                    <option value="Constance lake">Constance lake</option>
                    <option value="Cookstown">Cookstown</option>
                    <option value="Copetown">Copetown</option>
                    <option value="Copper Cliff">Copper Cliff</option>
                    <option value="Corbeil">Corbeil</option>
                    <option value="Corbyville">Corbyville</option>
                    <option value="Cormac">Cormac</option>
                    <option value="Cornwall">Cornwall</option>
                    <option value="Corunna">Corunna</option>
                    <option value="Cottam">Cottam</option>
                    <option value="Courtbright">Courtbright</option>
                    <option value="Courtbright">Courtbright</option>
                    <option value="Courtice">Courtice</option>
                    <option value="Courtland">Courtland</option>
                    <option value="Courtright">Courtright</option>
                    <option value="Crediton">Crediton</option>
                    <option value="Creemore">Creemore</option>
                    <option value="Creighton">Creighton</option>
                    <option value="Croton">Croton</option>
                    <option value="Crysler">Crysler</option>
                    <option value="Crystal Beach">Crystal Beach</option>
                    <option value="Crystal Falls">Crystal Falls</option>
                    <option value="Cumberland">Cumberland</option>
                    <option value="Cumberland beach">Cumberland beach</option>
                    <option value="Curran">Curran</option>
                    <option value="Curve lake">Curve lake</option>
                    <option value="Cutler">Cutler</option>
                    <option value="Dacre">Dacre</option>
                    <option value="Dalkeith">Dalkeith</option>
                    <option value="Dalles">Dalles</option>
                    <option value="Dashwood">Dashwood</option>
                    <option value="Deep River">Deep River</option>
                    <option value="Deer lake">Deer lake</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Delta">Delta</option>
                    <option value="Demorestville">Demorestville</option>
                    <option value="Denbigh">Denbigh</option>
                    <option value="Denfield">Denfield</option>
                    <option value="Desbarats">Desbarats</option>
                    <option value="Desboro">Desboro</option>
                    <option value="Deseronto">Deseronto</option>
                    <option value="Deux Rivieres">Deux Rivieres</option>
                    <option value="Devlin">Devlin</option>
                    <option value="Dinorwic">Dinorwic</option>
                    <option value="Dobbinton">Dobbinton</option>
                    <option value="Dobie">Dobie</option>
                    <option value="Dokis First Nation">
                      Dokis First Nation
                    </option>
                    <option value="Dorchester">Dorchester</option>
                    <option value="Dorion">Dorion</option>
                    <option value="Dorset">Dorset</option>
                    <option value="Douglas">Douglas</option>
                    <option value="Douro-Dummer">Douro-Dummer</option>
                    <option value="Dover Centre">Dover Centre</option>
                    <option value="Dowling">Dowling</option>
                    <option value="Drayton">Drayton</option>
                    <option value="Dresden">Dresden</option>
                    <option value="Driftwood">Driftwood</option>
                    <option value="Drumbo">Drumbo</option>
                    <option value="Dryden">Dryden</option>
                    <option value="Duart">Duart</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Dubreuilville">Dubreuilville</option>
                    <option value="Dunchurch">Dunchurch</option>
                    <option value="Dundalk">Dundalk</option>
                    <option value="Dundas">Dundas</option>
                    <option value="Dungannon">Dungannon</option>
                    <option value="Dunnville">Dunnville</option>
                    <option value="Dunrobin">Dunrobin</option>
                    <option value="Dunsford">Dunsford</option>
                    <option value="Duntroon">Duntroon</option>
                    <option value="Dunvegan">Dunvegan</option>
                    <option value="Durham">Durham</option>
                    <option value="Dutton">Dutton</option>
                    <option value="Dwight">Dwight</option>
                    <option value="Eabamet lake">Eabamet lake</option>
                    <option value="Eagle lake">Eagle lake</option>
                    <option value="Eagle river">Eagle river</option>
                    <option value="Ear falls">Ear falls</option>
                    <option value="Earlton">Earlton</option>
                    <option value="East Garafraxa">East Garafraxa</option>
                    <option value="East Gwillimbury">East Gwillimbury</option>
                    <option value="East York">East York</option>
                    <option value="Echo Bay">Echo Bay</option>
                    <option value="Eden">Eden</option>
                    <option value="Eden Mills">Eden Mills</option>
                    <option value="Edwards">Edwards</option>
                    <option value="Eganville">Eganville</option>
                    <option value="Egbert">Egbert</option>
                    <option value="Egmondville">Egmondville</option>
                    <option value="Eldorado">Eldorado</option>
                    <option value="Elgin">Elgin</option>
                    <option value="Elginburg">Elginburg</option>
                    <option value="Elizabethtown">Elizabethtown</option>
                    <option value="Elk lake">Elk lake</option>
                    <option value="Elliot Lake">Elliot Lake</option>
                    <option value="Elmira">Elmira</option>
                    <option value="Elmvale">Elmvale</option>
                    <option value="Elmwood">Elmwood</option>
                    <option value="Elora">Elora</option>
                    <option value="Embro">Embro</option>
                    <option value="Embrun">Embrun</option>
                    <option value="Emeryville">Emeryville</option>
                    <option value="Emo">Emo</option>
                    <option value="Emsdale">Emsdale</option>
                    <option value="Englehart">Englehart</option>
                    <option value="Ennismore">Ennismore</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Erieau">Erieau</option>
                    <option value="Erin">Erin</option>
                    <option value="Erinsville">Erinsville</option>
                    <option value="Espanola">Espanola</option>
                    <option value="Essex">Essex</option>
                    <option value="Ethel">Ethel</option>
                    <option value="Etobicoke">Etobicoke</option>
                    <option value="Evansville">Evansville</option>
                    <option value="Everett">Everett</option>
                    <option value="Exeter">Exeter</option>
                    <option value="Falconbridge">Falconbridge</option>
                    <option value="Fauquier">Fauquier</option>
                    <option value="Fenelon Falls">Fenelon Falls</option>
                    <option value="Fenwick">Fenwick</option>
                    <option value="Fergus">Fergus</option>
                    <option value="Feversham">Feversham</option>
                    <option value="Field">Field</option>
                    <option value="Finch">Finch</option>
                    <option value="Fingal">Fingal</option>
                    <option value="Fisherville">Fisherville</option>
                    <option value="Fitzroy Harbour">Fitzroy Harbour</option>
                    <option value="Flesherton">Flesherton</option>
                    <option value="Flinton">Flinton</option>
                    <option value="Floradale">Floradale</option>
                    <option value="Florence">Florence</option>
                    <option value="Foleyet">Foleyet</option>
                    <option value="Fonthill">Fonthill</option>
                    <option value="Fordwich">Fordwich</option>
                    <option value="Forest">Forest</option>
                    <option value="Foresters Falls">Foresters Falls</option>
                    <option value="Formosa">Formosa</option>
                    <option value="Fort albany">Fort albany</option>
                    <option value="Fort Erie">Fort Erie</option>
                    <option value="Fort Frances">Fort Frances</option>
                    <option value="Fort severn">Fort severn</option>
                    <option value="Fort William First Nation">
                      Fort William First Nation
                    </option>
                    <option value="Fournier">Fournier</option>
                    <option value="Fowler">Fowler</option>
                    <option value="Foxboro">Foxboro</option>
                    <option value="Foymount">Foymount</option>
                    <option value="Frankford">Frankford</option>
                    <option value="Frankville">Frankville</option>
                    <option value="Fraserville">Fraserville</option>
                    <option value="Frederickhouse">Frederickhouse</option>
                    <option value="Freelton">Freelton</option>
                    <option value="Fullarton">Fullarton</option>
                    <option value="Gads Hill">Gads Hill</option>
                    <option value="Gananoque">Gananoque</option>
                    <option value="Garden River">Garden River</option>
                    <option value="Garden Village">Garden Village</option>
                    <option value="Garson">Garson</option>
                    <option value="Gatineau">Gatineau</option>
                    <option value="Gelncairn">Gelncairn</option>
                    <option value="Gelncoe">Gelncoe</option>
                    <option value="Georgetown">Georgetown</option>
                    <option value="Georgian Bluffs">Georgian Bluffs</option>
                    <option value="Georgina">Georgina</option>
                    <option value="Geraldton">Geraldton</option>
                    <option value="Gilford">Gilford</option>
                    <option value="Gilmour">Gilmour</option>
                    <option value="Glen Huron">Glen Huron</option>
                    <option value="Glen Morris">Glen Morris</option>
                    <option value="Glen Robertson">Glen Robertson</option>
                    <option value="Glen Williams">Glen Williams</option>
                    <option value="Glenburnie">Glenburnie</option>
                    <option value="Glencairn">Glencairn</option>
                    <option value="Glencoe">Glencoe</option>
                    <option value="Gloucester">Gloucester</option>
                    <option value="Goderich">Goderich</option>
                    <option value="Godfrey">Godfrey</option>
                    <option value="Gogama">Gogama</option>
                    <option value="Golden Lake">Golden Lake</option>
                    <option value="Golden valley">Golden valley</option>
                    <option value="Gooderham">Gooderham</option>
                    <option value="Goodwood">Goodwood</option>
                    <option value="Gore Bay">Gore Bay</option>
                    <option value="Gores Landing">Gores Landing</option>
                    <option value="Gorham">Gorham</option>
                    <option value="Gormley">Gormley</option>
                    <option value="Gorrie">Gorrie</option>
                    <option value="Goulais River">Goulais River</option>
                    <option value="Gowanstown">Gowanstown</option>
                    <option value="Gowganda">Gowganda</option>
                    <option value="Grafton">Grafton</option>
                    <option value="Graham">Graham</option>
                    <option value="Grananoque">Grananoque</option>
                    <option value="Grand Bend">Grand Bend</option>
                    <option value="Grand Valley">Grand Valley</option>
                    <option value="Grande Pointe">Grande Pointe</option>
                    <option value="Granton">Granton</option>
                    <option value="Grassie">Grassie</option>
                    <option value="Grassy narrows">Grassy narrows</option>
                    <option value="Gravenhurst">Gravenhurst</option>
                    <option value="Greater madawaska">Greater madawaska</option>
                    <option value="Greely">Greely</option>
                    <option value="Green Valley">Green Valley</option>
                    <option value="Greenbank">Greenbank</option>
                    <option value="Greenwood">Greenwood</option>
                    <option value="Griffith">Griffith</option>
                    <option value="Grimsby">Grimsby</option>
                    <option value="Guelph">Guelph</option>
                    <option value="Guelph-Eramosa">Guelph-Eramosa</option>
                    <option value="Gull bay">Gull bay</option>
                    <option value="H1826	">H1826 </option>
                    <option value="Hagar">Hagar</option>
                    <option value="Hagersville">Hagersville</option>
                    <option value="Haileybury">Haileybury</option>
                    <option value="Haldimand">Haldimand</option>
                    <option value="Haley Station">Haley Station</option>
                    <option value="Haliburton">Haliburton</option>
                    <option value="Hallebourg">Hallebourg</option>
                    <option value="Halton Hills">Halton Hills</option>
                    <option value="Hamilton">Hamilton</option>
                    <option value="Hamilton Township">Hamilton Township</option>
                    <option value="Hammond">Hammond</option>
                    <option value="Hampton">Hampton</option>
                    <option value="Hanmer">Hanmer</option>
                    <option value="Hannon">Hannon</option>
                    <option value="Hanover">Hanover</option>
                    <option value="Harcourt">Harcourt</option>
                    <option value="harley">harley</option>
                    <option value="Harrietsville">Harrietsville</option>
                    <option value="Harriston">Harriston</option>
                    <option value="Harrow">Harrow</option>
                    <option value="Harrowsmith">Harrowsmith</option>
                    <option value="hartington">hartington</option>
                    <option value="Harty">Harty</option>
                    <option value="Harwood">Harwood</option>
                    <option value="Hastings">Hastings</option>
                    <option value="Havelock">Havelock</option>
                    <option value="Hawk junction">Hawk junction</option>
                    <option value="Hawkesbury">Hawkesbury</option>
                    <option value="Hawkestone">Hawkestone</option>
                    <option value="Hawkesville">Hawkesville</option>
                    <option value="Hay">Hay</option>
                    <option value="Haydon">Haydon</option>
                    <option value="HBMTWP">HBMTWP</option>
                    <option value="Hearst">Hearst</option>
                    <option value="Heathcote">Heathcote</option>
                    <option value="Heidelberg">Heidelberg</option>
                    <option value="Hensall">Hensall</option>
                    <option value="Hepworth">Hepworth</option>
                    <option value="Heron bay">Heron bay</option>
                    <option value="Hiawatha">Hiawatha</option>
                    <option value="Hickson">Hickson</option>
                    <option value="Highgate">Highgate</option>
                    <option value="Highland Grove">Highland Grove</option>
                    <option value="Hilliardton">Hilliardton</option>
                    <option value="Hillier">Hillier</option>
                    <option value="Hillsburgh">Hillsburgh</option>
                    <option value="Hillsdale">Hillsdale</option>
                    <option value="Hilton Beach">Hilton Beach</option>
                    <option value="Holland Centre">Holland Centre</option>
                    <option value="Holland Landing">Holland Landing</option>
                    <option value="Holstein">Holstein</option>
                    <option value="Holtyre">Holtyre</option>
                    <option value="Holyrood">Holyrood</option>
                    <option value="Honey harbour">Honey harbour</option>
                    <option value="Hornby">Hornby</option>
                    <option value="Hornell Heights">Hornell Heights</option>
                    <option value="Hornepayne">Hornepayne</option>
                    <option value="Hornings Mills">Hornings Mills</option>
                    <option value="Horton">Horton</option>
                    <option value="Hudson">Hudson</option>
                    <option value="Hunta">Hunta</option>
                    <option value="Huntsville">Huntsville</option>
                    <option value="Huron park">Huron park</option>
                    <option value="Ignace">Ignace</option>
                    <option value="Ilderton">Ilderton</option>
                    <option value="Indian River">Indian River</option>
                    <option value="Ingersoll">Ingersoll</option>
                    <option value="Ingleside">Ingleside</option>
                    <option value="Inglewood">Inglewood</option>
                    <option value="Ingolf">Ingolf</option>
                    <option value="Inkerman">Inkerman</option>
                    <option value="Innerkip">Innerkip</option>
                    <option value="Innisfil">Innisfil</option>
                    <option value="Inverary">Inverary</option>
                    <option value="Inwood">Inwood</option>
                    <option value="Iona Station">Iona Station</option>
                    <option value="Iron Bridge">Iron Bridge</option>
                    <option value="Irondale">Irondale</option>
                    <option value="Iroquois">Iroquois</option>
                    <option value="Iroquois Falls">Iroquois Falls</option>
                    <option value="Iroquois falls a">Iroquois falls a</option>
                    <option value="Jacksons Point">Jacksons Point</option>
                    <option value="Jacques">Jacques</option>
                    <option value="Janetville">Janetville</option>
                    <option value="Jarvis">Jarvis</option>
                    <option value="Jasper">Jasper</option>
                    <option value="Jellicoe">Jellicoe</option>
                    <option value="Jerseyville">Jerseyville</option>
                    <option value="Jogues">Jogues</option>
                    <option value="Johnstown">Johnstown</option>
                    <option value="Jordan station">Jordan station</option>
                    <option value="Joyceville">Joyceville</option>
                    <option value="Juniper island">Juniper island</option>
                    <option value="Kagawong">Kagawong</option>
                    <option value="Kakabeka Falls">Kakabeka Falls</option>
                    <option value="Kaladar">Kaladar</option>
                    <option value="Kaministiquia">Kaministiquia</option>
                    <option value="Kanata">Kanata</option>
                    <option value="Kapuskasing">Kapuskasing</option>
                    <option value="Kars">Kars</option>
                    <option value="Kasabonika">Kasabonika</option>
                    <option value="Kashabowie">Kashabowie</option>
                    <option value="Kashechewan">Kashechewan</option>
                    <option value="Katrine">Katrine</option>
                    <option value="Kawartha Lakes ">Kawartha Lakes </option>
                    <option value="Kearney">Kearney</option>
                    <option value="Kearns">Kearns</option>
                    <option value="Keene">Keene</option>
                    <option value="Keewatin">Keewatin</option>
                    <option value="Keewaywin">Keewaywin</option>
                    <option value="Kejick">Kejick</option>
                    <option value="Kemble">Kemble</option>
                    <option value="Kemptville">Kemptville</option>
                    <option value="Kenabeek">Kenabeek</option>
                    <option value="Kendal">Kendal</option>
                    <option value="Kenilworth">Kenilworth</option>
                    <option value="Kenmore">Kenmore</option>
                    <option value="Kenora">Kenora</option>
                    <option value="Kent Bridge">Kent Bridge</option>
                    <option value="Kerwood">Kerwood</option>
                    <option value="Keswick">Keswick</option>
                    <option value="Kettle and Stony Point FN">
                      Kettle and Stony Point FN
                    </option>
                    <option value="Killaloe">Killaloe</option>
                    <option value="Killarney">Killarney</option>
                    <option value="Kilworthy">Kilworthy</option>
                    <option value="Kimberley">Kimberley</option>
                    <option value="Kinburn">Kinburn</option>
                    <option value="Kincardine">Kincardine</option>
                    <option value="King">King</option>
                    <option value="King city">King city</option>
                    <option value="King kirkland">King kirkland</option>
                    <option value="Kingfisher lake">Kingfisher lake</option>
                    <option value="Kingston">Kingston</option>
                    <option value="Kingsville">Kingsville</option>
                    <option value="Kinmount">Kinmount</option>
                    <option value="Kintore">Kintore</option>
                    <option value="Kippen">Kippen</option>
                    <option value="Kirkfield">Kirkfield</option>
                    <option value="Kirkland Lake">Kirkland Lake</option>
                    <option value="Kirkton">Kirkton</option>
                    <option value="Kitchener">Kitchener</option>
                    <option value="Kleinburg">Kleinburg</option>
                    <option value="Komoka">Komoka</option>
                    <option value="L'Amable">L'Amable</option>
                    <option value="L'Original">L'Original</option>
                    <option value="L'orignal">L'orignal</option>
                    <option value="La Salette">La Salette</option>
                    <option value="Lac La Croix First Nation">
                      Lac La Croix First Nation
                    </option>
                    <option value="Lac seul">Lac seul</option>
                    <option value="Lake of Bays">Lake of Bays</option>
                    <option value="Lake st peter">Lake st peter</option>
                    <option value="Lakefield">Lakefield</option>
                    <option value="Lakehurst">Lakehurst</option>
                    <option value="Lakeside">Lakeside</option>
                    <option value="Lambton Shores">Lambton Shores</option>
                    <option value="Lanark">Lanark</option>
                    <option value="Lancaster">Lancaster</option>
                    <option value="Langton">Langton</option>
                    <option value="Lansdowne">Lansdowne</option>
                    <option value="Lansdowne house">Lansdowne house</option>
                    <option value="Larder lake">Larder lake</option>
                    <option value="Lasalle">Lasalle</option>
                    <option value="Latchford">Latchford</option>
                    <option value="Lavigne">Lavigne</option>
                    <option value="Leamington">Leamington</option>
                    <option value="Leaskdale">Leaskdale</option>
                    <option value="Lefaivre">Lefaivre</option>
                    <option value="Lefroy">Lefroy</option>
                    <option value="Leith">Leith</option>
                    <option value="Levack">Levack</option>
                    <option value="Levigne">Levigne</option>
                    <option value="Limehouse">Limehouse</option>
                    <option value="Limoges">Limoges</option>
                    <option value="Lincoln">Lincoln</option>
                    <option value="Lindsay">Lindsay</option>
                    <option value="Linwood">Linwood</option>
                    <option value="Lions Head">Lions Head</option>
                    <option value="Lisle">Lisle</option>
                    <option value="Listowel">Listowel</option>
                    <option value="Litle Britain">Litle Britain</option>
                    <option value="Little britain">Little britain</option>
                    <option value="Little Current">Little Current</option>
                    <option value="Lively">Lively</option>
                    <option value="Locust Hill">Locust Hill</option>
                    <option value="Lombardy">Lombardy</option>
                    <option value="Londesborough">Londesborough</option>
                    <option value="London">London</option>
                    <option value="Long Sault">Long Sault</option>
                    <option value="Longbow lake">Longbow lake</option>
                    <option value="Longford Mills">Longford Mills</option>
                    <option value="Longlac">Longlac</option>
                    <option value="Loretto">Loretto</option>
                    <option value="Loring">Loring</option>
                    <option value="Lowbanks">Lowbanks</option>
                    <option value="Lucan">Lucan</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Lunenburg">Lunenburg</option>
                    <option value="Lyn">Lyn</option>
                    <option value="Lynden">Lynden</option>
                    <option value="Lyndhurst">Lyndhurst</option>
                    <option value="M'chigeeng">M'chigeeng</option>
                    <option value="Maberly">Maberly</option>
                    <option value="Macdiarmid">Macdiarmid</option>
                    <option value="Mackey">Mackey</option>
                    <option value="Mactier">Mactier</option>
                    <option value="Madawaska">Madawaska</option>
                    <option value="Madoc">Madoc</option>
                    <option value="Madsen">Madsen</option>
                    <option value="Magnetawan">Magnetawan</option>
                    <option value="Maidstone">Maidstone</option>
                    <option value="Maitland">Maitland</option>
                    <option value="Mallorytown">Mallorytown</option>
                    <option value="Manilla">Manilla</option>
                    <option value="Manitouwadge ">Manitouwadge </option>
                    <option value="Manitowaning">Manitowaning</option>
                    <option value="Manotick">Manotick</option>
                    <option value="Mansfield">Mansfield</option>
                    <option value="Maple">Maple</option>
                    <option value="Maple Leaf">Maple Leaf</option>
                    <option value="Mar">Mar</option>
                    <option value="Marathon">Marathon</option>
                    <option value="Markdale">Markdale</option>
                    <option value="Markham">Markham</option>
                    <option value="Markstay">Markstay</option>
                    <option value="Marlbank">Marlbank</option>
                    <option value="Marmora">Marmora</option>
                    <option value="Marten river">Marten river</option>
                    <option value="Martintown">Martintown</option>
                    <option value="Maryhill">Maryhill</option>
                    <option value="Marysville">Marysville</option>
                    <option value="Massey">Massey</option>
                    <option value="Matachewan">Matachewan</option>
                    <option value="Matheson">Matheson</option>
                    <option value="Mattawa">Mattawa</option>
                    <option value="Mattice">Mattice</option>
                    <option value="Maughton">Maughton</option>
                    <option value="Maxville">Maxville</option>
                    <option value="Maxwell">Maxwell</option>
                    <option value="Maynooth">Maynooth</option>
                    <option value="McArthurs Mills">McArthurs Mills</option>
                    <option value="Mcdonalds corners">Mcdonalds corners</option>
                    <option value="McDonals Corner">McDonals Corner</option>
                    <option value="McDougall">McDougall</option>
                    <option value="McGregor">McGregor</option>
                    <option value="McKellar">McKellar</option>
                    <option value="Mckenzie island">Mckenzie island</option>
                    <option value="Mckerrow">Mckerrow</option>
                    <option value="McNab/1459">McNab/1459</option>
                    <option value="Mcnab/braeside">Mcnab/braeside</option>
                    <option value="Meaford">Meaford</option>
                    <option value="Melancthon">Melancthon</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Meldrum Bay">Meldrum Bay</option>
                    <option value="Melncthon">Melncthon</option>
                    <option value="Merlin">Merlin</option>
                    <option value="Merrickville">Merrickville</option>
                    <option value="Metcalfe">Metcalfe</option>
                    <option value="Midhurst">Midhurst</option>
                    <option value="Midland">Midland</option>
                    <option value="Migisi sahgaigan">Migisi sahgaigan</option>
                    <option value="Mildmay">Mildmay</option>
                    <option value="Milford">Milford</option>
                    <option value="Milford bay">Milford bay</option>
                    <option value="Millbank">Millbank</option>
                    <option value="Millbrook">Millbrook</option>
                    <option value="Miller Lake">Miller Lake</option>
                    <option value="Millgrove">Millgrove</option>
                    <option value="Milton">Milton</option>
                    <option value="Milverton">Milverton</option>
                    <option value="Minaki">Minaki</option>
                    <option value="Mindemoya">Mindemoya</option>
                    <option value="Minden">Minden</option>
                    <option value="Mine centre">Mine centre</option>
                    <option value="Minesing">Minesing</option>
                    <option value="Minett">Minett</option>
                    <option value="Minnitaki">Minnitaki</option>
                    <option value="Missanabie">Missanabie</option>
                    <option value="Mississauga">Mississauga</option>
                    <option value="Mississippi station">
                      Mississippi station
                    </option>
                    <option value="Mitchell">Mitchell</option>
                    <option value="Mobert">Mobert</option>
                    <option value="Moffat">Moffat</option>
                    <option value="Monetville">Monetville</option>
                    <option value="Monkland">Monkland</option>
                    <option value="Monkton">Monkton</option>
                    <option value="Mono">Mono</option>
                    <option value="Monteith">Monteith</option>
                    <option value="Montreal river harbour">
                      Montreal river harbour
                    </option>
                    <option value="Moonbeam">Moonbeam</option>
                    <option value="Moonstone">Moonstone</option>
                    <option value="Moorefield">Moorefield</option>
                    <option value="Mooretown">Mooretown</option>
                    <option value="Moose Creek">Moose Creek</option>
                    <option value="Moose factory">Moose factory</option>
                    <option value="Moosonee">Moosonee</option>
                    <option value="Morewood">Morewood</option>
                    <option value="Morpeth">Morpeth</option>
                    <option value="Morrisburg">Morrisburg</option>
                    <option value="Morriston">Morriston</option>
                    <option value="Morson">Morson</option>
                    <option value="Mossley">Mossley</option>
                    <option value="Mount Albert">Mount Albert</option>
                    <option value="Mount Brydges">Mount Brydges</option>
                    <option value="Mount Elgin">Mount Elgin</option>
                    <option value="Mount Forest">Mount Forest</option>
                    <option value="Mount Hope">Mount Hope</option>
                    <option value="Mount Pleasant">Mount Pleasant</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Mountain Grove">Mountain Grove</option>
                    <option value="Muirkirk">Muirkirk</option>
                    <option value="Muirkirt">Muirkirt</option>
                    <option value="Mulmur">Mulmur</option>
                    <option value="Muncey">Muncey</option>
                    <option value="Municipality of Brooke-Alvinston">
                      Municipality of Brooke-Alvinston
                    </option>
                    <option value="Municipality of Brooke-Alvinston">
                      Municipality of Brooke-Alvinston
                    </option>
                    <option value="Munster">Munster</option>
                    <option value="Murillo">Murillo</option>
                    <option value="Muskoka">Muskoka</option>
                    <option value="Muskrat dam">Muskrat dam</option>
                    <option value="Nairn Centre">Nairn Centre</option>
                    <option value="Nakina">Nakina</option>
                    <option value="Nanticoke">Nanticoke</option>
                    <option value="Napanee">Napanee</option>
                    <option value="Naughton">Naughton</option>
                    <option value="Navan">Navan</option>
                    <option value="Neebing">Neebing</option>
                    <option value="Nepean">Nepean</option>
                    <option value="Nestleton Station">Nestleton Station</option>
                    <option value="Nestor falls">Nestor falls</option>
                    <option value="Neustadt">Neustadt</option>
                    <option value="New Dundee">New Dundee</option>
                    <option value="New Hamburg">New Hamburg</option>
                    <option value="New Liskeard">New Liskeard</option>
                    <option value="New lowell">New lowell</option>
                    <option value="New Tecumseth">New Tecumseth</option>
                    <option value="Newboro">Newboro</option>
                    <option value="Newburgh">Newburgh</option>
                    <option value="Newbury">Newbury</option>
                    <option value="Newcastle">Newcastle</option>
                    <option value="Newington">Newington</option>
                    <option value="Newmarket">Newmarket</option>
                    <option value="Newton">Newton</option>
                    <option value="Newtonville">Newtonville</option>
                    <option value="Neyaashiinigmiing">Neyaashiinigmiing</option>
                    <option value="Niagara Falls">Niagara Falls</option>
                    <option value="Niagara on the Lake">
                      Niagara on the Lake
                    </option>
                    <option value="Nipigon">Nipigon</option>
                    <option value="Nipissing">Nipissing</option>
                    <option value="Nobel">Nobel</option>
                    <option value="Nobleton">Nobleton</option>
                    <option value="Noelville">Noelville</option>
                    <option value="Nolalu">Nolalu</option>
                    <option value="Norfolk County">Norfolk County</option>
                    <option value="Norland">Norland</option>
                    <option value="North Augusta">North Augusta</option>
                    <option value="North Bay">North Bay</option>
                    <option value="North Buxton">North Buxton</option>
                    <option value="North cobalt">North cobalt</option>
                    <option value="North Dumfries">North Dumfries</option>
                    <option value="North Gower">North Gower</option>
                    <option value="North Kawartha">North Kawartha</option>
                    <option value="North Lancaster">North Lancaster</option>
                    <option value="North spirit lake">North spirit lake</option>
                    <option value="North York">North York</option>
                    <option value="Northbrook">Northbrook</option>
                    <option value="Northern Bruce Peninsula">
                      Northern Bruce Peninsula
                    </option>
                    <option value="Norval">Norval</option>
                    <option value="Norwich">Norwich</option>
                    <option value="Norwood">Norwood</option>
                    <option value="Nottawa">Nottawa</option>
                    <option value="Novar">Novar</option>
                    <option value="Oakland">Oakland</option>
                    <option value="Oakville">Oakville</option>
                    <option value="Oakwood">Oakwood</option>
                    <option value="Oba">Oba</option>
                    <option value="Odessa">Odessa</option>
                    <option value="Ogoki">Ogoki</option>
                    <option value="Ohsweken">Ohsweken</option>
                    <option value="Oil City">Oil City</option>
                    <option value="Oil Springs">Oil Springs</option>
                    <option value="Oldcastle">Oldcastle</option>
                    <option value="Omemee">Omemee</option>
                    <option value="Ompah">Ompah</option>
                    <option value="Onaping">Onaping</option>
                    <option value="Opasatika">Opasatika</option>
                    <option value="Orangeville">Orangeville</option>
                    <option value="Orillia">Orillia</option>
                    <option value="Orleans">Orleans</option>
                    <option value="Oro">Oro</option>
                    <option value="Oro Medonte">Oro Medonte</option>
                    <option value="Oro Station">Oro Station</option>
                    <option value="Oro-Medonte">Oro-Medonte</option>
                    <option value="Orono">Orono</option>
                    <option value="Orton">Orton</option>
                    <option value="Osgoode">Osgoode</option>
                    <option value="Oshawa">Oshawa</option>
                    <option value="Osnaburgh house">Osnaburgh house</option>
                    <option value="Otonabee">Otonabee</option>
                    <option value="Ottawa">Ottawa</option>
                    <option value="Otterville">Otterville</option>
                    <option value="Owen Sound">Owen Sound</option>
                    <option value="Oxdrift">Oxdrift</option>
                    <option value="Oxford Mills">Oxford Mills</option>
                    <option value="Oxford Station">Oxford Station</option>
                    <option value="Pain Court">Pain Court</option>
                    <option value="Paisley">Paisley</option>
                    <option value="Pakenham">Pakenham</option>
                    <option value="Palgrave">Palgrave</option>
                    <option value="Palmer Rapids">Palmer Rapids</option>
                    <option value="Palmerston">Palmerston</option>
                    <option value="Parham">Parham</option>
                    <option value="Paris">Paris</option>
                    <option value="Parkhill">Parkhill</option>
                    <option value="Parry Sound">Parry Sound</option>
                    <option value="Pass Lake">Pass Lake</option>
                    <option value="Pawitik">Pawitik</option>
                    <option value="Pays placeat">Pays placeat</option>
                    <option value="Pays Plat">Pays Plat</option>
                    <option value="Peawanuck">Peawanuck</option>
                    <option value="Pefferlaw">Pefferlaw</option>
                    <option value="Pelee Island">Pelee Island</option>
                    <option value="Pelham">Pelham</option>
                    <option value="Pembroke">Pembroke</option>
                    <option value="Penetanguishene">Penetanguishene</option>
                    <option value="Perrault falls">Perrault falls</option>
                    <option value="Perth">Perth</option>
                    <option value="Perth Road">Perth Road</option>
                    <option value="Petawawa">Petawawa</option>
                    <option value="Peterborough">Peterborough</option>
                    <option value="Petersburg">Petersburg</option>
                    <option value="Petrolia">Petrolia</option>
                    <option value="Phelpston">Phelpston</option>
                    <option value="Pickerel">Pickerel</option>
                    <option value="Pickering">Pickering</option>
                    <option value="Pickle lake">Pickle lake</option>
                    <option value="Picton">Picton</option>
                    <option value="Pikangikum">Pikangikum</option>
                    <option value="Pikwakanagan">Pikwakanagan</option>
                    <option value="Pinewood">Pinewood</option>
                    <option value="Plainfield">Plainfield</option>
                    <option value="Plantagenet">Plantagenet</option>
                    <option value="Plattsville">Plattsville</option>
                    <option value="Plevna">Plevna</option>
                    <option value="Point Edward">Point Edward</option>
                    <option value="Pointe aux roches">Pointe aux roches</option>
                    <option value="Pointe Aux Rochs">Pointe Aux Rochs</option>
                    <option value="Pointe-au-baril-station">
                      Pointe-au-baril-station
                    </option>
                    <option value="Pontypool">Pontypool</option>
                    <option value="Poole">Poole</option>
                    <option value="Poplar hill">Poplar hill</option>
                    <option value="Porcupine">Porcupine</option>
                    <option value="Porquis junction">Porquis junction</option>
                    <option value="Port Alma">Port Alma</option>
                    <option value="Port Burwell">Port Burwell</option>
                    <option value="Port Carling">Port Carling</option>
                    <option value="Port Colborne">Port Colborne</option>
                    <option value="Port Dover">Port Dover</option>
                    <option value="Port Elgin">Port Elgin</option>
                    <option value="Port Franks">Port Franks</option>
                    <option value="Port Hope">Port Hope</option>
                    <option value="Port lambton">Port lambton</option>
                    <option value="Port Lampton">Port Lampton</option>
                    <option value="Port loring">Port loring</option>
                    <option value="Port McNicoll">Port McNicoll</option>
                    <option value="Port Perry">Port Perry</option>
                    <option value="Port Robinson">Port Robinson</option>
                    <option value="Port Rowan">Port Rowan</option>
                    <option value="Port sandfield">Port sandfield</option>
                    <option value="Port Severn">Port Severn</option>
                    <option value="Port Stanley">Port Stanley</option>
                    <option value="Port Sydney">Port Sydney</option>
                    <option value="Portland">Portland</option>
                    <option value="Powassan">Powassan</option>
                    <option value="Prescott">Prescott</option>
                    <option value="Priceville">Priceville</option>
                    <option value="Prince albert">Prince albert</option>
                    <option value="Prince TWP">Prince TWP</option>
                    <option value="Princeton">Princeton</option>
                    <option value="Proton Station">Proton Station</option>
                    <option value="Providence Bay">Providence Bay</option>
                    <option value="Puslinch">Puslinch</option>
                    <option value="Putnam">Putnam</option>
                    <option value="Quadeville">Quadeville</option>
                    <option value="Queenston">Queenston</option>
                    <option value="Queensville">Queensville</option>
                    <option value="Quinte West">Quinte West</option>
                    <option value="Rainy river">Rainy river</option>
                    <option value="Raith">Raith</option>
                    <option value="Rama">Rama</option>
                    <option value="Ramara">Ramara</option>
                    <option value="Ramore">Ramore</option>
                    <option value="Ramsayville">Ramsayville</option>
                    <option value="Ramsey">Ramsey</option>
                    <option value="Ravenna">Ravenna</option>
                    <option value="Reaboro">Reaboro</option>
                    <option value="Red lake">Red lake</option>
                    <option value="Red Rock">Red Rock</option>
                    <option value="Redbridge">Redbridge</option>
                    <option value="Redditt">Redditt</option>
                    <option value="Renfrew">Renfrew</option>
                    <option value="Restoule">Restoule</option>
                    <option value="Richards landing">Richards landing</option>
                    <option value="Richmond">Richmond</option>
                    <option value="Richmond Hill">Richmond Hill</option>
                    <option value="Rideau ferry">Rideau ferry</option>
                    <option value="Ridgetown">Ridgetown</option>
                    <option value="Ridgeville">Ridgeville</option>
                    <option value="Ridgeway">Ridgeway</option>
                    <option value="Ripley">Ripley</option>
                    <option value="River Drive Park">River Drive Park</option>
                    <option value="River Valley">River Valley</option>
                    <option value="Roblin">Roblin</option>
                    <option value="Roches Point">Roches Point</option>
                    <option value="Rockcliffe">Rockcliffe</option>
                    <option value="Rockland">Rockland</option>
                    <option value="Rockport">Rockport</option>
                    <option value="Rockton">Rockton</option>
                    <option value="Rockwood">Rockwood</option>
                    <option value="Rodney">Rodney</option>
                    <option value="Rolphton">Rolphton</option>
                    <option value="Rosemont">Rosemont</option>
                    <option value="Roseneath">Roseneath</option>
                    <option value="Roslin">Roslin</option>
                    <option value="Rosseau">Rosseau</option>
                    <option value="Rosslyn">Rosslyn</option>
                    <option value="Rossport">Rossport</option>
                    <option value="Rostock">Rostock</option>
                    <option value="Round Lake Centre">Round Lake Centre</option>
                    <option value="Ruscom Station">Ruscom Station</option>
                    <option value="Russel">Russel</option>
                    <option value="Russell">Russell</option>
                    <option value="Rutherglen">Rutherglen</option>
                    <option value="Ruthven">Ruthven</option>
                    <option value="Sachigo lake">Sachigo lake</option>
                    <option value="Saint-Pascal-Babylon">
                      Saint-Pascal-Babylon
                    </option>
                    <option value="Saint-pascal-baylon">
                      Saint-pascal-baylon
                    </option>
                    <option value="Salford">Salford</option>
                    <option value="Sand point fn">Sand point fn</option>
                    <option value="Sandford">Sandford</option>
                    <option value="Sandy lake">Sandy lake</option>
                    <option value="Sarnia">Sarnia</option>
                    <option value="Sarsfield">Sarsfield</option>
                    <option value="Sauble Beach">Sauble Beach</option>
                    <option value="Sault Ste. Marie">Sault Ste. Marie</option>
                    <option value="Savant lake">Savant lake</option>
                    <option value="Scarborough">Scarborough</option>
                    <option value="Schomberg">Schomberg</option>
                    <option value="Schreiber">Schreiber</option>
                    <option value="Schumacher">Schumacher</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Scugog">Scugog</option>
                    <option value="Seaforth">Seaforth</option>
                    <option value="Seagrave">Seagrave</option>
                    <option value="Searchmont">Searchmont</option>
                    <option value="Sebright">Sebright</option>
                    <option value="Sebringville">Sebringville</option>
                    <option value="Seeleys Bay">Seeleys Bay</option>
                    <option value="Seguin">Seguin</option>
                    <option value="Selby">Selby</option>
                    <option value="Selkirk">Selkirk</option>
                    <option value="Selwyn">Selwyn</option>
                    <option value="Serpent River">Serpent River</option>
                    <option value="Sesekinika">Sesekinika</option>
                    <option value="Severn">Severn</option>
                    <option value="Severn Bridge">Severn Bridge</option>
                    <option value="Shakespeare">Shakespeare</option>
                    <option value="Shallow Lake">Shallow Lake</option>
                    <option value="Shannonville">Shannonville</option>
                    <option value="Shanty Bay">Shanty Bay</option>
                    <option value="Sharbot Lake">Sharbot Lake</option>
                    <option value="Sharon">Sharon</option>
                    <option value="Shebandowan">Shebandowan</option>
                    <option value="Shedden">Shedden</option>
                    <option value="Sheffield">Sheffield</option>
                    <option value="Sheguiandah">Sheguiandah</option>
                    <option value="Shelburne">Shelburne</option>
                    <option value="Sherkston">Sherkston</option>
                    <option value="Sheshegwaning">Sheshegwaning</option>
                    <option value="Shining tree">Shining tree</option>
                    <option value="Shuniah">Shuniah</option>
                    <option value="Silver water">Silver water</option>
                    <option value="Simcoe">Simcoe</option>
                    <option value="Singhampton">Singhampton</option>
                    <option value="Sioux Lookout">Sioux Lookout</option>
                    <option value="Sioux narrows">Sioux narrows</option>
                    <option value="Skead">Skead</option>
                    <option value="Slate Falls">Slate Falls</option>
                    <option value="Slate River">Slate River</option>
                    <option value="Sleeman">Sleeman</option>
                    <option value="Smiths Falls">Smiths Falls</option>
                    <option value="Smithville">Smithville</option>
                    <option value="Smooth rock falls">Smooth rock falls</option>
                    <option value="Snow road station">Snow road station</option>
                    <option value="Sombra">Sombra</option>
                    <option value="South baymouth">South baymouth</option>
                    <option value="South Bruce Peninsula">
                      South Bruce Peninsula
                    </option>
                    <option value="South Gillies">South Gillies</option>
                    <option value="South Glengarry">South Glengarry</option>
                    <option value="South lancaster">South lancaster</option>
                    <option value="South mountain">South mountain</option>
                    <option value="South Porcupine">South Porcupine</option>
                    <option value="South River">South River</option>
                    <option value="South Stormont">South Stormont</option>
                    <option value="South Woodslee">South Woodslee</option>
                    <option value="Southampton">Southampton</option>
                    <option value="Southwold">Southwold</option>
                    <option value="Southworld">Southworld</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Sparta">Sparta</option>
                    <option value="Spencerville">Spencerville</option>
                    <option value="Spragge">Spragge</option>
                    <option value="Spring Bay">Spring Bay</option>
                    <option value="Springbrook">Springbrook</option>
                    <option value="Springfield">Springfield</option>
                    <option value="Springford">Springford</option>
                    <option value="Springwater">Springwater</option>
                    <option value="Sprucedale">Sprucedale</option>
                    <option value="St Agatha">St Agatha</option>
                    <option value="St Albert">St Albert</option>
                    <option value="St Andrews West">St Andrews West</option>
                    <option value="St Anns">St Anns</option>
                    <option value="St Bernardin">St Bernardin</option>
                    <option value="St Catharines">St Catharines</option>
                    <option value="St Charles">St Charles</option>
                    <option value="St Clements">St Clements</option>
                    <option value="St Davids">St Davids</option>
                    <option value="St Eugene">St Eugene</option>
                    <option value="St George Brant">St George Brant</option>
                    <option value="St Isidore">St Isidore</option>
                    <option value="St Jacobs">St Jacobs</option>
                    <option value="St Joachim">St Joachim</option>
                    <option value="St Marys">St Marys</option>
                    <option value="St Thomas">St Thomas</option>
                    <option value="St Williams">St Williams</option>
                    <option value="St. Catharines">St. Catharines</option>
                    <option value="St. Pauls">St. Pauls</option>
                    <option value="Staffa">Staffa</option>
                    <option value="Staples">Staples</option>
                    <option value="Stayner">Stayner</option>
                    <option value="Ste Anne De Prescott">
                      Ste Anne De Prescott
                    </option>
                    <option value="Stella">Stella</option>
                    <option value="Stevensville">Stevensville</option>
                    <option value="Stirling">Stirling</option>
                    <option value="Stittsville">Stittsville</option>
                    <option value="Stokes bay">Stokes bay</option>
                    <option value="Stonecliffe">Stonecliffe</option>
                    <option value="Stoney Creek">Stoney Creek</option>
                    <option value="Stouffville">Stouffville</option>
                    <option value="Straffordville">Straffordville</option>
                    <option value="Stratford">Stratford</option>
                    <option value="Strathroy">Strathroy</option>
                    <option value="Stratton">Stratton</option>
                    <option value="Strickland">Strickland</option>
                    <option value="Sturgeon Falls">Sturgeon Falls</option>
                    <option value="Sudbury">Sudbury</option>
                    <option value="Sultan">Sultan</option>
                    <option value="Summer beaver">Summer beaver</option>
                    <option value="Summerstown">Summerstown</option>
                    <option value="Sundbridge">Sundbridge</option>
                    <option value="Sunderland">Sunderland</option>
                    <option value="Sundridge">Sundridge</option>
                    <option value="Sutton West">Sutton West</option>
                    <option value="Swastika">Swastika</option>
                    <option value="Sydenham">Sydenham</option>
                    <option value="Talbotville royal">Talbotville royal</option>
                    <option value="Tamworth">Tamworth</option>
                    <option value="Tara">Tara</option>
                    <option value="Tarzwell">Tarzwell</option>
                    <option value="Tavistock">Tavistock</option>
                    <option value="Tecumesh">Tecumesh</option>
                    <option value="Tecumseh">Tecumseh</option>
                    <option value="Teeswater">Teeswater</option>
                    <option value="Teeterville">Teeterville</option>
                    <option value="Tehkummah">Tehkummah</option>
                    <option value="Temagami">Temagami</option>
                    <option value="Terra Cotta">Terra Cotta</option>
                    <option value="Terrace Bay">Terrace Bay</option>
                    <option value="Thamesford">Thamesford</option>
                    <option value="Thamesville">Thamesville</option>
                    <option value="The Archipelago">The Archipelago</option>
                    <option value="Thedford">Thedford</option>
                    <option value="Thessalon">Thessalon</option>
                    <option value="Thomasburg">Thomasburg</option>
                    <option value="Thornbury">Thornbury</option>
                    <option value="Thorndale">Thorndale</option>
                    <option value="Thorne">Thorne</option>
                    <option value="Thornhill">Thornhill</option>
                    <option value="Thornloe">Thornloe</option>
                    <option value="Thornton">Thornton</option>
                    <option value="Thorold">Thorold</option>
                    <option value="Thunder Bay">Thunder Bay</option>
                    <option value="Tichborne">Tichborne</option>
                    <option value="Tilbury">Tilbury</option>
                    <option value="Tilden lake">Tilden lake</option>
                    <option value="Tillsonburg">Tillsonburg</option>
                    <option value="Timmins">Timmins</option>
                    <option value="Tiny">Tiny</option>
                    <option value="Tiverton">Tiverton</option>
                    <option value="Tobermory">Tobermory</option>
                    <option value="Toledo">Toledo</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Torrance">Torrance</option>
                    <option value="Tory Hill">Tory Hill</option>
                    <option value="Tottenham">Tottenham</option>
                    <option value="Town of Plympton Wyoming">
                      Town of Plympton Wyoming
                    </option>
                    <option value="Townsend">Townsend</option>
                    <option value="Township of wilmot">
                      Township of wilmot
                    </option>
                    <option value="Trent Lakes">Trent Lakes</option>
                    <option value="Trent river">Trent river</option>
                    <option value="Trenton">Trenton</option>
                    <option value="Trout Creek">Trout Creek</option>
                    <option value="Troy">Troy</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Tupperville">Tupperville</option>
                    <option value="Turkey point">Turkey point</option>
                    <option value="Tweed">Tweed</option>
                    <option value="Udora">Udora</option>
                    <option value="Union">Union</option>
                    <option value="Unionville">Unionville</option>
                    <option value="Upsala">Upsala</option>
                    <option value="Utopia">Utopia</option>
                    <option value="Utterson">Utterson</option>
                    <option value="Uxbridge">Uxbridge</option>
                    <option value="Val Caron">Val Caron</option>
                    <option value="Val cote">Val cote</option>
                    <option value="Val Gagne">Val Gagne</option>
                    <option value="Val Rita">Val Rita</option>
                    <option value="Val Therese">Val Therese</option>
                    <option value="Vanessa">Vanessa</option>
                    <option value="Vanier">Vanier</option>
                    <option value="Vankleek Hill">Vankleek Hill</option>
                    <option value="Varna">Varna</option>
                    <option value="Vars">Vars</option>
                    <option value="Vaughan">Vaughan</option>
                    <option value="Vermilion Bay">Vermilion Bay</option>
                    <option value="Verner">Verner</option>
                    <option value="Vernon">Vernon</option>
                    <option value="Verona">Verona</option>
                    <option value="Victoria harbour">Victoria harbour</option>
                    <option value="Vienna">Vienna</option>
                    <option value="Vineland">Vineland</option>
                    <option value="Vineland Station">Vineland Station</option>
                    <option value="Virgil">Virgil</option>
                    <option value="Virginiatown">Virginiatown</option>
                    <option value="Vittoria">Vittoria</option>
                    <option value="Wabigoon">Wabigoon</option>
                    <option value="Wahnapitae">Wahnapitae</option>
                    <option value="Wainfleet">Wainfleet</option>
                    <option value="Waldhof">Waldhof</option>
                    <option value="Walford station">Walford station</option>
                    <option value="Walkerton">Walkerton</option>
                    <option value="Wallaceburg">Wallaceburg</option>
                    <option value="Wallacetown">Wallacetown</option>
                    <option value="Wallenstein">Wallenstein</option>
                    <option value="Walsingham">Walsingham</option>
                    <option value="Walters Falls">Walters Falls</option>
                    <option value="Walton">Walton</option>
                    <option value="Wardsville">Wardsville</option>
                    <option value="Warkworth">Warkworth</option>
                    <option value="Warminster">Warminster</option>
                    <option value="Warren">Warren</option>
                    <option value="Warsaw">Warsaw</option>
                    <option value="Warwick Township">Warwick Township</option>
                    <option value="Wasaga Beach">Wasaga Beach</option>
                    <option value="Washago">Washago</option>
                    <option value="Waterdown">Waterdown</option>
                    <option value="Waterford">Waterford</option>
                    <option value="Waterloo">Waterloo</option>
                    <option value="Watford">Watford</option>
                    <option value="Watten township">Watten township</option>
                    <option value="Waubaushene">Waubaushene</option>
                    <option value="Wawa">Wawa</option>
                    <option value="Weagamow lake">Weagamow lake</option>
                    <option value="Webbwood">Webbwood</option>
                    <option value="Webequie">Webequie</option>
                    <option value="Welland">Welland</option>
                    <option value="Wellandport">Wellandport</option>
                    <option value="Wellesley">Wellesley</option>
                    <option value="Wellington">Wellington</option>
                    <option value="Wendover">Wendover</option>
                    <option value="West Guilford">West Guilford</option>
                    <option value="West Lincoln">West Lincoln</option>
                    <option value="West Lorne">West Lorne</option>
                    <option value="West Montrose">West Montrose</option>
                    <option value="Westbrook">Westbrook</option>
                    <option value="Westmeath">Westmeath</option>
                    <option value="Westport">Westport</option>
                    <option value="Westwood">Westwood</option>
                    <option value="Wheatley">Wheatley</option>
                    <option value="Whitby">Whitby</option>
                    <option value="White Lake">White Lake</option>
                    <option value="White river">White river</option>
                    <option value="Whitedog">Whitedog</option>
                    <option value="Whitefish">Whitefish</option>
                    <option value="Whitefish falls">Whitefish falls</option>
                    <option value="Whitevale">Whitevale</option>
                    <option value="Whitney">Whitney</option>
                    <option value="Wiarton">Wiarton</option>
                    <option value="Wikwemikong">Wikwemikong</option>
                    <option value="Wilberforce">Wilberforce</option>
                    <option value="Wilkesport">Wilkesport</option>
                    <option value="Williamsburg">Williamsburg</option>
                    <option value="Williamsford">Williamsford</option>
                    <option value="Williamstown">Williamstown</option>
                    <option value="Willow Beach">Willow Beach</option>
                    <option value="Wilmot">Wilmot</option>
                    <option value="Wilno">Wilno</option>
                    <option value="Wilsonville">Wilsonville</option>
                    <option value="Winchester">Winchester</option>
                    <option value="Winchester Springs">
                      Winchester Springs
                    </option>
                    <option value="Windermere">Windermere</option>
                    <option value="Windham Centre">Windham Centre</option>
                    <option value="Windsor">Windsor</option>
                    <option value="Wingham">Wingham</option>
                    <option value="Wolfe Island">Wolfe Island</option>
                    <option value="Woodbridge">Woodbridge</option>
                    <option value="Woodham">Woodham</option>
                    <option value="Woodlawn">Woodlawn</option>
                    <option value="Woodstock">Woodstock</option>
                    <option value="Woodview">Woodview</option>
                    <option value="Woodville">Woodville</option>
                    <option value="Wooler">Wooler</option>
                    <option value="Woolwich">Woolwich</option>
                    <option value="Worthington">Worthington</option>
                    <option value="Wroxeter">Wroxeter</option>
                    <option value="Wunnumin Lake">Wunnumin Lake</option>
                    <option value="Wyebridge">Wyebridge</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Yarker">Yarker</option>
                    <option value="York">York</option>
                    <option value="Youngs Point">Youngs Point</option>
                    <option value="Zephyr">Zephyr</option>
                    <option value="Zhiibaahaasing">Zhiibaahaasing</option>
                    <option value="Zurich">Zurich</option>
                    <option value="Not Specified">Not Specified</option>
                  </select>
                </div>
              </div>
              <div className="form-footer">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  onClick={() => {
                    if (payload.firstName === "") {
                      toast.error("First name is required");
                    } else if (
                      payload.email === "" ||
                      !validations.email(payload.email)
                    ) {
                      toast.error("Email is invalid");
                    } else if (payload.dob === "") {
                      toast.error("Date of Birth is required");
                    } else if (payload.password === "") {
                      toast.error("Please enter Password");
                    } else if (!validations.password(payload.password)) {
                      toast.error(
                        "Invalid Password. Password must minimum 8 characters long and contain Alphanumeric characters"
                      );
                    } else {
                      registerUserService(payload).then((response) => {
                        if (response.status === 200) {
                          if (response.data.response === "success") {
                            toast.success(response.data.msg);
                            navigate("/login");
                          } else {
                            toast.error(response.data.msg);
                            if (response.data.status === "logout") {
                              logout();
                            }
                          }
                        } else {
                          logout();
                          navigate("/login");
                        }
                      });
                    }
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
