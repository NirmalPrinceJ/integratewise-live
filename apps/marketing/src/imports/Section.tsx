import imgImageTheDoctor from "figma:asset/59ef7b6391d1ba5819e5de7223000f5ca11425da.png";
import imgImageTheStudent from "figma:asset/76c2e175827c117a45c6394320f1700e235acb2c.png";
import imgImageTheSmallBusinessOwner from "figma:asset/d975d011c23ec4e740ef239e2f6878e562e3c507.png";
import imgImageTheFreelancer from "figma:asset/d52a7bc60bbefb377bebc171907508c4369f934f.png";
import imgImageTheParent from "figma:asset/b6f5f0fa1b7b14059dbdec93c691ba3b5eb12903.png";
import imgImageTheExecutive from "figma:asset/626064216e736773c6fd2329d3ce59f5e0182b95.png";

function Frame() {
  return <div className="shrink-0 size-[100px]" />;
}

function Heading() {
  return (
    <div className="h-[46.797px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[46.8px] left-[492.77px] not-italic text-[#111] text-[36px] text-center top-[0.5px]">{`This isn't a tech problem. It's a human problem.`}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[26.398px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[26.4px] left-[491.89px] not-italic text-[#666] text-[17.6px] text-center top-[-0.5px]">Sound familiar?</p>
    </div>
  );
}

function ImageTheDoctor() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Doctor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheDoctor} />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheDoctor />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Doctor</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[97.906px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[236px] whitespace-pre-wrap">Three apps open during a patient visit. History in one, prescription in another, lab report in a third. She becomes the copy-paste layer.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[178.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-white h-[356.547px] left-0 rounded-[16px] top-0 w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container2 />
        <Container3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageTheStudent() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Student)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheStudent} />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheStudent />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Student</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[97.906px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[237px] whitespace-pre-wrap">Lecture notes in Docs. Research in ChatGPT. PDFs in Downloads. Assignment on a portal. Final version? Who knows which folder.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[178.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading2 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-white h-[356.547px] left-[338.66px] rounded-[16px] top-0 w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container5 />
        <Container6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageTheSmallBusinessOwner() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Small Business Owner)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheSmallBusinessOwner} />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheSmallBusinessOwner />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Small Business Owner</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[97.906px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[223px] whitespace-pre-wrap">Orders on WhatsApp. Invoices in email. Stock in a spreadsheet. Payments in an app. Things fall through cracks.</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[178.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white h-[356.547px] left-[677.33px] rounded-[16px] top-0 w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container8 />
        <Container9 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageTheFreelancer() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Freelancer)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheFreelancer} />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheFreelancer />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Freelancer</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[73.43px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[235px] whitespace-pre-wrap">Five clients, five different tools per client. Entire day spent context-switching, not creating.</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[154.07px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading4 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-white h-[356.547px] left-0 rounded-[16px] top-[388.55px] w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container11 />
        <Container12 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageTheParent() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Parent)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheParent} />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheParent />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Parent</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[97.906px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[223px] whitespace-pre-wrap">School group on one WhatsApp. Family on another. Bills in email. Photos in iCloud. Tax papers in... somewhere.</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[178.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading5 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white h-[356.547px] left-[338.66px] rounded-[16px] top-[388.55px] w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container14 />
        <Container15 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageTheExecutive() {
  return (
    <div className="h-[176px] relative shrink-0 w-full" data-name="Image (The Executive)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTheExecutive} />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTheExecutive />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24.641px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24.64px] left-0 not-italic text-[#111] text-[17.6px] top-[-0.5px]">The Executive</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[97.906px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24.48px] left-0 not-italic text-[#666] text-[14.4px] top-0 w-[238px] whitespace-pre-wrap">Dashboards in five tabs. Reports in three formats. Decisions made on partial information because full context lives in ten places.</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[178.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading6 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white h-[356.547px] left-[677.33px] rounded-[16px] top-[388.55px] w-[306.664px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container17 />
        <Container18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[745.094px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container4 />
      <Container7 />
      <Container10 />
      <Container13 />
      <Container16 />
    </div>
  );
}

export default function Section() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[16px] items-start pt-[128px] px-[58px] relative size-full" data-name="Section">
      <Frame />
      <Heading />
      <Paragraph />
      <Container />
    </div>
  );
}