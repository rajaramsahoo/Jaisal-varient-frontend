import React from 'react'
import CommonLayout from '../../component/shop/common-layout'
import { Container } from 'react-bootstrap'
import AnimatedCounter from './AnimatedCounter'


const AboutUs = () => {
  return (
    <>
      <div className='aboutUsPage'>
        <CommonLayout>

          {/* banner area start */}
          <div className='abouBannerBx'>
            <Container>
              <div className='bannerContent'>
                <h1 align="center"><span>ABOUT US</span></h1>
                <h2 align="center">From Field to Home</h2>
                <p align="center">Each grain of rice travels a simple path—<br />
                  from our farms to your meals—<br />
                  with care along the way.</p>
              </div>
            </Container>
          </div>
          {/* banner area end */}

          {/* mid wrapper start */}
          <div className='aboutUsWrapper'>
            {/* part 1 start */}
            <div className='partOne'>
              <div className='container'>
                <h2 align="center">Experience the Best of Grains,<br />Curated for You</h2>
                <p>Our dedication to traditional farming, clean practices, and careful selection ensures that every<br />
                  grain you receive is a reflection of nature’s goodness<br />
                  grown with care and delivered with honesty.</p>
                <div className='row'>
                  <div className='col-sm-4'>
                    <img src="/assets/images/about-us/aboutPartA.webp" alt="" />
                  </div>
                  <div className='col-sm-8'>
                    <img src="/assets/images/about-us/aboutPartB.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>
            {/* part 1 end */}

            {/* part 2 start */}
            <div className='partTwo'>
              <div className='container'>
                <h2 align="center">Why Jaisal Organic?</h2>
                <div className='row'>
                  <div className='col-md-3 col-sm-6 col-12 text-center'>
                    <h3><img src="/assets/images/about-us/spoon.svg" alt="" style={{ width: '24px' }} /> Naturally Aged</h3>
                    <p>Old basmati rice, matured for rich aroma & perfect texture.</p>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12 text-center'>
                    <h3><img src="/assets/images/about-us/tree.svg" alt="" style={{ width: '24px' }} /> Sustainably Grown</h3>
                    <p>Eco-friendly farming, rooted in tradition.</p>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12 text-center'>
                    <h3><img src="/assets/images/about-us/rise.svg" alt="" style={{ width: '24px' }} /> Extra-Long Grains</h3>
                    <p>Elongates up to 24mm — ideal for premium dishes.</p>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12 text-center'>
                    <h3><img src="/assets/images/about-us/tractor.svg" alt="" style={{ width: '32px' }} /> Farm Fresh</h3>
                    <p>Direct from farms, no middlemen —  just pure, fresh rice.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* part 2 end */}

            {/* part 3 start */}
            <div className='partThree'>
              <div className='headBx'>
                <div className='d-flex align-items-start'>
                  <img src="/assets/images/about-us/tree-2.svg" alt="" style={{ width: '44px' }} />
                  <div>
                    <h2 align="center">Join the Grain Revolution</h2>
                    <p align="center">Discover meaningful experiences that connect you with the origins of you food. From farm visits to cooking workshops and harvest festivals, Our events are designed to inspire, educate, and celebrate the journey from field to plate.</p>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-8 mb-3'>
                    <img src="/assets/images/about-us/revolution.jpg" className='rounded-4' style={{ width: '100%' }} alt="" />
                  </div>
                  <div className='col-md-4'>
                    <div className='greenBx' style={{ width: '85%' }}>
                      <div>
                        <h4><img src="/assets/images/about-us/icon-cube.svg" style={{ width: '32px' }} alt="" /> <AnimatedCounter target={50000} duration={1000} />+ kg</h4>
                        <p>Grains harvested and delivered</p>
                      </div>
                    </div>
                    <div className='greenBx' style={{ width: '80%' }}>
                      <div>
                        <h4><img src="/assets/images/about-us/icon-users.svg" style={{ width: '52px' }} alt="" /> <AnimatedCounter target={10000} duration={1000} />+</h4>
                        <p>Happy customers across India</p>
                      </div>
                    </div>
                    <div className='greenBx'>
                      <div>
                        <h4><img src="/assets/images/about-us/icon-check.svg" style={{ width: '32px' }} alt="" /> <AnimatedCounter target={98} duration={1} />%</h4>
                        <p>Customer satisfaction rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* part 3 end */}

            {/* part 4 start */}
            <div className='partFour'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-6'>
                    <h3>Ready to Reconnect<br />With the Roots?</h3>
                    <p>Join our upcoming farm experiences and discover how traditional grains are grown, aged, and prepared. Whether you're a conscious eater,
                      curious traveler, or culinary enthusiast — there’s something to explore and learn.</p>
                    {/* <a className='btn btnWhite' href="/">Explore Experiences</a> */}
                  </div>
                </div>
              </div>
            </div>
            {/* part 4 end */}
          </div>
          {/* mid wrapper end */}

        </CommonLayout>
      </div>
    </>
  )
}

export default AboutUs