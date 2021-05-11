const AdminPanel = ({
  index,
  meal,
  handleAdminPanelChange,
}) => (
  <div className="form-group">
    <div className="text-secondary pb-2">
      <h4>ADMIN PANEL for student number {`${index + 1}`} </h4>
    </div>

    <div className="pb-2">
      <input
        data-index={index}
        // key={i}
        type="text"
        className="form-control"
        placeholder="Student Name"
        onChange={handleAdminPanelChange('studentName')}
        // onChange={testCallback}
      />
    </div>

    <div className="pb-2">
      <select
        data-index={index}
        // key={i}
        type="text"
        className="form-control"
        placeholder="Student School"
        onChange={handleAdminPanelChange('schoolName')}
      >
        <option value="">Choose School</option>
        <option value="DK">Preschool</option>
        <option value="BES">BES</option>
        <option value="OHES">OHES</option>
        <option value="ROES">ROES</option>
        <option value="MCMS">MCMS</option>
        <option value="OPHS">OPHS</option>
        <option value="OVHS">OVHS</option>
        <option value="OPIS">OPIS</option>
        <option value="NON">Non OPUSD </option>
      </select>
    </div>

    {/* TODO pb-2 div */}
    <div className="pb-2">
      <select
        data-index={index}
        // key={i}
        type="text"
        className="form-control"
        placeholder="Cohort"
        defaultValue={meal.group}
        onChange={handleAdminPanelChange('group')}
      >
        <option value="">Choose Cohort</option>
        <option value="distance-learning">Distance</option>
        <option value="a-group">A Cohort</option>
        <option value="b-group">B Cohort</option>
      </select>
    </div>

    {meal.group != 'distance-learning' && (
      <select
        data-index={index}
        // key={i}
        type="text"
        className="form-control"
        placeholder="Cohort"
        onChange={handleAdminPanelChange('teacher')}
      >
        <option value="">Choose Teacher</option>
        <option value="k-annino/lee">K - Annino/Lee</option>
        <option value="k-milbourn">K - Milbourn</option>
        <option value="k-sloan">K - Sloan</option>
        <option value="k-foy">K - Foy</option>
        <option value="k-lobianco">K - LoBianco</option>
        <option value="1st-hirano">1st - Hirano</option>
        <option value="1st-morrow">1st - Morrow</option>
        <option value="1st-aaronson">1st - Aaronson</option>
        <option value="1st-bretzing">1st - Bretzing</option>
        <option value="1st-bird">1st - Bird</option>
        <option value="1st-ewing">1st - Ewing</option>
        <option value="1st-holland">1st - Holland</option>
        <option value="2nd-watson">2nd - Watson</option>
        <option value="2nd-gerin">2nd - Gerin</option>
        <option value="2nd-lieberman">2nd - Lieberman</option>
        <option value="2nd-ruben">2nd - Ruben</option>
        <option value="2nd-mcdowell">2nd - McDowell</option>
        <option value="2nd-share">2nd - Share</option>
        <option value="3rd-squire">3rd - Squire</option>
        <option value="3rd-altman">3rd - Altman</option>
        <option value="3rd-rosenblum">3rd - Rosenblum</option>
        <option value="3rd-cantillon">3rd - Cantillon</option>
        <option value="3rd-strong">3rd - Strong</option>
        <option value="3rd-arnold">3rd - Arnold</option>
        <option value="4th-keane">4th - Keane</option>
        <option value="4th-farlow">4th - Farlow</option>
        <option value="4th-lockrey">4th - Lockrey</option>
        <option value="4th-chobanian">4th - Chobanian</option>
        <option value="4th-duffy">4th - Duffy</option>
        <option value="4th-matthews">4th - Matthews</option>
        <option value="5th-stephens">5th - Stephens</option>
        <option value="5th-becker">5th - Becker</option>
        <option value="5th-powers">5th - Powers</option>
        <option value="5th-bailey">5th - Bailey</option>
        <option value="5th-bodily">5th - Bodily</option>
        <option value="5th-cass">5th - Cass</option>
        <option value="6th-grade">6th </option>
        <option value="7th-grade">7th </option>
        <option value="8th-grade">8th </option>
        <option value="9th-grade">9th</option>
        <option value="10th-grade">10th </option>
        <option value="11th-grade">11th </option>
        <option value="12th-grade">12th </option>
      </select>
    )}
    <hr />
  </div>
);

export default AdminPanel;
