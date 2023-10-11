import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ACTION_NAVBAR_IS_VISIBLE from "../../actions/NavbarIsVisible/ACTION_NAVBAR_IS_VISIBLE";
import ACTION_SPLASH_SCREEN_COMPLETE from "../../actions/SplashScreenComplete/ACTION_SPLASH_SCREEN_COMPLETE";
import ACTION_SPLASH_SCREEN_HALFWAY from "../../actions/SplashScreenHalfway/ACTION_SPLASH_SCREEN_HALFWAY";
import "./Policies.css";

const TermsAndConditions = () => {
  const dispatch = useDispatch();

  const splashScreenHalfway = useSelector(
    (state) => state.splashScreenHalfway.splashScreenHalfway
  );
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );

  useEffect(() => {
    dispatch(ACTION_NAVBAR_IS_VISIBLE());

    if (!splashScreenComplete) {
      dispatch(ACTION_SPLASH_SCREEN_COMPLETE());
    }

    if (!splashScreenHalfway) {
      dispatch(ACTION_SPLASH_SCREEN_HALFWAY());
    }
  }, [dispatch, splashScreenComplete, splashScreenHalfway]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy_main_container">
      <h1>
        <strong>Terms and Conditions</strong>
      </h1>
      <p>
        <i>Last updated: January 1st, {new Date().getFullYear()}</i>
      </p>

      <p>Welcome to Choiredex!</p>

      <p>
        By accessing this website we assume you accept these terms and
        conditions. Do not continue to use Choiredex Facial Bar if you do not
        agree to take all of the terms and conditions stated on this page.
      </p>

      <p>
        The following terminology applies to these Terms and Conditions, Privacy
        Statement and Disclaimer Notice and all Agreements: "Client", "You" and
        "Your" refers to you, the person log on this website and compliant to
        the Company’s terms and conditions. "The Company", "Ourselves", "We",
        "Our" and "Us", refers to our Company. "Party", "Parties", or "Us",
        refers to both the Client and ourselves. All terms refer to the offer,
        acceptance and consideration of payment necessary to undertake the
        process of our assistance to the Client in the most appropriate manner
        for the express purpose of meeting the Client’s needs in respect of
        provision of the Company’s stated services, in accordance with and
        subject to, prevailing law of Netherlands. Any use of the above
        terminology or other words in the singular, plural, capitalization
        and/or he/she or they, are taken as interchangeable and therefore as
        referring to same.
      </p>

      <h2>
        <strong>Cookies</strong>
      </h2>

      <p>
        We employ the use of cookies. By accessing Choiredex Facial Bar, you
        agreed to use cookies in agreement with the Choiredex's Privacy Policy.{" "}
      </p>

      <p>
        Most interactive websites use cookies to let us retrieve the user’s
        details for each visit. Cookies are used by our website to enable the
        functionality of certain areas to make it easier for people visiting our
        website. Some of our affiliate/advertising partners may also use
        cookies.
      </p>

      <h2>
        <strong>License</strong>
      </h2>

      <p>You must not:</p>
      <ul>
        <li>Republish material from Choiredex Facial Bar</li>
        <li>Sell, rent or sub-license material from Choiredex Facial Bar</li>
        <li>Reproduce, duplicate or copy material from Choiredex Facial Bar</li>
        <li>Redistribute content from Choiredex Facial Bar</li>
      </ul>

      <p>
        This Agreement shall begin on the date hereof. Our Terms and Conditions
        were created with the help of the{" "}
        <a href="https://www.termsandconditionsgenerator.com">
          Terms And Conditions Generator
        </a>{" "}
        and the{" "}
        <a href="https://www.generateprivacypolicy.com">
          Privacy Policy Generator
        </a>
        .
      </p>

      <p>You warrant and represent that:</p>

      <ul>
        <li>
          You are entitled to post the Comments on our website and have all
          necessary licenses and consents to do so;
        </li>
        <li>
          The Comments do not invade any intellectual property right, including
          without limitation copyright, patent or trademark of any third party;
        </li>
        <li>
          The Comments do not contain any defamatory, libelous, offensive,
          indecent or otherwise unlawful material which is an invasion of
          privacy
        </li>
        <li>
          The Comments will not be used to solicit or promote business or custom
          or present commercial activities or unlawful activity.
        </li>
      </ul>

      <h2>
        <strong>Hyperlinking to our Content</strong>
      </h2>

      <p>
        The following organizations may link to our Website without prior
        written approval:
      </p>

      <ul>
        <li>Government agencies;</li>
        <li>Search engines;</li>
        <li>News organizations;</li>
        <li>
          Online directory distributors may link to our Website in the same
          manner as they hyperlink to the Websites of other listed businesses;
          and
        </li>
        <li>
          System wide Accredited Businesses except soliciting non-profit
          organizations, charity shopping malls, and charity fundraising groups
          which may not hyperlink to our Web site.
        </li>
      </ul>

      <p>
        These organizations may link to our home page, to publications or to
        other Website information so long as the link: (a) is not in any way
        deceptive; (b) does not falsely imply sponsorship, endorsement or
        approval of the linking party and its products and/or services; and (c)
        fits within the context of the linking party’s site.
      </p>

      <p>
        We may consider and approve other link requests from the following types
        of organizations:
      </p>

      <ul>
        <li>commonly-known consumer and/or business information sources;</li>
        <li>dot.com community sites;</li>
        <li>associations or other groups representing charities;</li>
        <li>online directory distributors;</li>
        <li>internet portals;</li>
        <li>accounting, law and consulting firms; and</li>
        <li>educational institutions and trade associations.</li>
      </ul>

  
      <p>Approved organizations may hyperlink to our Website as follows:</p>

      <ul>
        <li>By use of our corporate name; or</li>
        <li>By use of the uniform resource locator being linked to; or</li>
        <li>
          By use of any other description of our Website being linked to that
          makes sense within the context and format of content on the linking
          party’s site.
        </li>
      </ul>

      <h2>
        <strong>iFrames</strong>
      </h2>

      <p>
        Without prior approval and written permission, you may not create frames
        around our Webpages that alter in any way the visual presentation or
        appearance of our Website.
      </p>

      <h2>
        <strong>Content Liability</strong>
      </h2>

      <p>
        We shall not be hold responsible for any content that appears on your
        Website. You agree to protect and defend us against all claims that is
        rising on your Website. No link(s) should appear on any Website that may
        be interpreted as libelous, obscene or criminal, or which infringes,
        otherwise violates, or advocates the infringement or other violation of,
        any third party rights.
      </p>

      <h2>
        <strong>Your Privacy</strong>
      </h2>

      <p>Please read Privacy Policy</p>

      <h2>
        <strong>Reservation of Rights</strong>
      </h2>

      <p>
        We reserve the right to request that you remove all links or any
        particular link to our Website. You approve to immediately remove all
        links to our Website upon request. We also reserve the right to amen
        these terms and conditions and it’s linking policy at any time. By
        continuously linking to our Website, you agree to be bound to and follow
        these linking terms and conditions.
      </p>

      <h2>
        <strong>Removal of links from our website</strong>
      </h2>

      <p>
        If you find any link on our Website that is offensive for any reason,
        you are free to contact and inform us any moment. We will consider
        requests to remove links but we are not obligated to or so or to respond
        to you directly.
      </p>

      <p>
        We do not ensure that the information on this website is correct, we do
        not warrant its completeness or accuracy; nor do we promise to ensure
        that the website remains available or that the material on the website
        is kept up to date.
      </p>

      <h2>
        <strong>Disclaimer</strong>
      </h2>

      <p>
        To the maximum extent permitted by applicable law, we exclude all
        representations, warranties and conditions relating to our website and
        the use of this website. Nothing in this disclaimer will:
      </p>

      <ul>
        <li>
          limit or exclude our or your liability for death or personal injury;
        </li>
        <li>
          limit or exclude our or your liability for fraud or fraudulent
          misrepresentation;
        </li>
        <li>
          limit any of our or your liabilities in any way that is not permitted
          under applicable law; or
        </li>
        <li>
          exclude any of our or your liabilities that may not be excluded under
          applicable law.
        </li>
      </ul>

      <p>
        The limitations and prohibitions of liability set in this Section and
        elsewhere in this disclaimer: (a) are subject to the preceding
        paragraph; and (b) govern all liabilities arising under the disclaimer,
        including liabilities arising in contract, in tort and for breach of
        statutory duty.
      </p>

      <p>
        As long as the website and the information and services on the website
        are provided free of charge, we will not be liable for any loss or
        damage of any nature.
      </p>
      <div className="policy_bottom_buttons_container">
        <Link className="next_policy_container" to="/privacy">
          <div className="next_policy_button">
            <p>Privacy Policy</p>
          </div>
        </Link>
        <div className="policy_back_to_home_button">
          <Link to="/">
            <p>Back to Home</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
