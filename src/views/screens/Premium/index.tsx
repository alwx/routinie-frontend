import React from "react";

import { useAppSelector } from "../../../hooks/store";
import { currentUser } from "../../../store/users";
import ControlBar from "../../blocks/ControlBar";
import Footer from "../../blocks/Footer";

import "../../blocks/Index/Index.scss";
import "./Premium.scss";
import { User } from "../../../types/users";
import { isEU } from "../../../utils/date";

const STRIPE_URL =
  process.env.REACT_APP_STRIPE_URL || "http://localhost:3001/stripe";

function Top() {
  const emojis = ["🏂", "🤾🏻‍♂️", "🤾🏿‍♀️"];
  const randEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <div className="top top--premium">
      <h1 className="top__title">
        <span>Boost much further.</span> {randEmoji}
      </h1>
      <div className="top__text">
        <span>Routinie Premium</span> adds more to <span>Routinie</span>, and
        transforms it to an ultimate solution for improving your habits and
        becoming better.
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="features features--premium">
      <div className="features__content">
        <div className="features__row">
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>More trackers.</span> 🏄
            </h3>
            <div className="feature__text">
              By default you can only keep three trackers active. Premium
              unblocks the limit and makes it possible to add as many trackers
              as you want.
            </div>
          </div>
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>Analytics.</span> 📈
            </h3>
            <div className="feature__text">
              <div className="feature__badge">
                <span>Available soon</span>
              </div>
              Want to know more about your performance and productivity? Premium
              users can analyze a bunch of graphs to see how their habits can be
              improved.
            </div>
          </div>
        </div>
        <div className="features__row">
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>More tracker types.</span> 🧩
            </h3>
            <div className="feature__text">
              <div className="feature__badge">
                <span>Available soon</span>
              </div>
              Want to make sure you do a workout three times per week? Or want
              to keep your money tracker continuously increasing until it
              reaches a certain value? Premium users can do more than just
              simple habit tracking.
            </div>
          </div>
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>Tracker notes.</span> 📎
            </h3>
            <div className="feature__text">
              <div className="feature__badge">
                <span>Available soon</span>
              </div>
              Want to leave an extra reminder for yourself? Or want to attach
              some extra information to a specific date to make the analysis of
              your trackers easier? Premium users can add notes to any trackers
              and dates and even extract this notes via API later on.
            </div>
          </div>
        </div>
        <div className="features__row">
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>More flexibility.</span> 🤸‍
            </h3>
            <div className="feature__text">
              More extras to make your tracking easier and your public profile
              nicer. Get additional tracking options, such as the ability to
              change events up to four days old.
            </div>
          </div>
          <div className="feature">
            <h3 className="feature__title feature__title--premium">
              <span>Twitter integration.</span> 🔑
            </h3>
            <div className="feature__text">
              <div className="feature__badge">
                <span>Available soon</span>
              </div>
              Want to publish your stats on your Twitter cover image? Premium
              users can do that as well!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PricingPlanProps {
  user?: User;
  name: string;
  price: string;
  newPrice?: string;
  newPriceTag?: string;
  description: string;
  priceId: string;
  coupon?: string;
  extraClass?: string;
}

function PricingPlan({
  user,
  name,
  price,
  newPrice,
  newPriceTag,
  description,
  priceId,
  coupon,
  extraClass,
}: PricingPlanProps) {
  return (
    <div className={"pricing-plan" + (extraClass ? " " + extraClass : "")}>
      <div className="pricing-plan__content">
        <h2 className="pricing-plan__title">
          <span>{name}</span>
        </h2>
        <div
          className={
            "pricing-plan__price" +
            (newPrice ? " pricing-plan__price--old" : "")
          }
        >
          {price}
        </div>
        {newPrice && (
          <div className="pricing-plan__new-price">
            <div className="pricing-plan__new-price-tag">{newPriceTag}</div>
            <div>{newPrice}</div>
          </div>
        )}
        <div className="pricing-plan__free">7 days free</div>

        <div className="pricing-plan__description">{description}</div>
      </div>

      {user && !user.subscribed_at && (
        <form
          action={STRIPE_URL + `/create-checkout-session`}
          method="POST"
          className="pricing-plan__form"
        >
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="priceId" value={priceId} />
          <input type="hidden" name="coupon" value={coupon} />
          <button type="submit" className="button">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

interface PricingPlansProps {
  user?: User;
}

function PricingPlansEUR({ user }: PricingPlansProps) {
  return (
    <div className="pricing-plans">
      <div className="pricing-plans__content">
        <PricingPlan
          user={user}
          name="Monthly"
          price="€4.50 per month"
          newPrice="€3.60 per month"
          newPriceTag="launch special 📣"
          description={
            "For those who prefer to keep things simple or just want to " +
            "make the first and easy step toward increased productivity " +
            "and efficiency."
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_EUR_MONTHLY || ""}
        />

        <PricingPlan
          user={user}
          name="Balanced"
          price="€12 every 3 months"
          newPrice="€9.60 every 3 months"
          newPriceTag="launch special 📣"
          description={
            "For those who want to save some money but are not yet sure " +
            "if they will be tracking continuously for a year. Ideal plan to check " +
            "if Routinie is a good fit for you!"
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_EUR_3MONTHS || ""}
        />

        <PricingPlan
          user={user}
          name="Yearly"
          price="€35 per year"
          newPrice="€28 per year"
          newPriceTag="launch special 📣"
          description={
            "For those who are serious about their goals and about their " +
            "intention to support Routinie and make it better."
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_EUR_YEARLY || ""}
          extraClass={
            user && user.subscribed_at ? "" : "pricing-plan--highlighted"
          }
        />
      </div>

      {user && user.subscribed_at && (
        <div className="pricing-plans__manage">
          <h2 className="pricing-plans__manage-title">
            <span>Thanks for being a subscriber!</span>
          </h2>

          <form action={STRIPE_URL + `/create-portal-session`} method="POST">
            <input
              type="hidden"
              name="sessionId"
              value={user.stripe_session_id}
            />
            <button type="submit" className="button">
              Upgrade or cancel your plan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function PricingPlansUSD({ user }: PricingPlansProps) {
  return (
    <div className="pricing-plans">
      <div className="pricing-plans__content">
        <PricingPlan
          user={user}
          name="Monthly"
          price="$4.50 per month"
          newPrice="$3.60 per month"
          newPriceTag="launch special 📣"
          description={
            "For those who prefer to keep things simple or just want to " +
            "make the first and easy step toward increased productivity " +
            "and efficiency."
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_USD_MONTHLY || ""}
        />

        <PricingPlan
          user={user}
          name="Balanced"
          price="$12 every 3 months"
          newPrice="$9.60 every 3 months"
          newPriceTag="launch special 📣"
          description={
            "For those who want to save some money but are not yet sure " +
            "if they will be tracking continuously for a year. Ideal plan to check " +
            "if Routinie is a good fit for you!"
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_USD_3MONTHS || ""}
        />

        <PricingPlan
          user={user}
          name="Yearly"
          price="$35 per year"
          newPrice="$28 per year"
          newPriceTag="launch special 📣"
          description={
            "For those who are serious about their goals and about their " +
            "intention to support Routinie and make it better."
          }
          coupon={process.env.REACT_APP_20PERCENT_COUPON || ""}
          priceId={process.env.REACT_APP_PRICE_USD_YEARLY || ""}
          extraClass={
            user && user.subscribed_at ? "" : "pricing-plan--highlighted"
          }
        />
      </div>

      {user && user.subscribed_at && (
        <div className="pricing-plans__manage">
          <h2 className="pricing-plans__manage-title">
            <span>Thanks for being a subscriber!</span>
          </h2>

          <form action={STRIPE_URL + `/create-portal-session`} method="POST">
            <input
              type="hidden"
              name="sessionId"
              value={user.stripe_session_id}
            />
            <button type="submit" className="button">
              Upgrade or cancel your plan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Premium() {
  const user = useAppSelector(currentUser);

  return (
    <div className="premium">
      <ControlBar
        page="premium"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />

      <div className="premium__content">
        <Top />
        <Features />
        {isEU() ? <PricingPlansEUR user={user} /> : <PricingPlansUSD user={user} />}
      </div>
      <Footer isNarrow={false} />
    </div>
  );
}
