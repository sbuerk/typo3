/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
define(["require","exports","jquery","../../Utility/MessageUtility","./../InlineRelation/AjaxDispatcher","nprogress","Sortable","TYPO3/CMS/Backend/FormEngine","TYPO3/CMS/Backend/FormEngineValidation","../../Icons","../../InfoWindow","../../Modal","../../Notification","../../Severity","../../Utility"],(function(e,t,n,i,r,o,a,s,l,c,d,u,g,h,p){"use strict";var m,f,b,v;!function(e){e.toggleSelector='[data-toggle="formengine-inline"]',e.controlSectionSelector=".t3js-formengine-irre-control",e.createNewRecordButtonSelector=".t3js-create-new-button",e.createNewRecordBySelectorSelector=".t3js-create-new-selector",e.deleteRecordButtonSelector=".t3js-editform-delete-inline-record",e.enableDisableRecordButtonSelector=".t3js-toggle-visibility-button",e.infoWindowButton='[data-action="infowindow"]',e.synchronizeLocalizeRecordButtonSelector=".t3js-synchronizelocalize-button",e.uniqueValueSelectors="select.t3js-inline-unique",e.revertUniqueness=".t3js-revert-unique",e.controlContainerButtons=".t3js-inline-controls"}(m||(m={})),function(e){e.new="inlineIsNewRecord",e.visible="panel-visible",e.collapsed="panel-collapsed"}(f||(f={})),function(e){e.structureSeparator="-"}(b||(b={})),function(e){e.DOWN="down",e.UP="up"}(v||(v={}));class S{constructor(e){this.container=null,this.ajaxDispatcher=null,this.appearance=null,this.requestQueue={},this.progessQueue={},this.noTitleString=TYPO3.lang?TYPO3.lang["FormEngine.noRecordTitle"]:"[No title]",this.handlePostMessage=e=>{if(!i.MessageUtility.verifyOrigin(e.origin))throw"Denied message sent by "+e.origin;if("typo3:elementBrowser:elementInserted"===e.data.actionName){if(void 0===e.data.objectGroup)throw"No object group defined for message";if(e.data.objectGroup!==this.container.dataset.objectGroup)return;if(this.isUniqueElementUsed(parseInt(e.data.uid,10),e.data.table))return void g.error("There is already a relation to the selected element");this.importRecord([e.data.objectGroup,e.data.uid])}},n(()=>{this.container=document.querySelector("#"+e),this.ajaxDispatcher=new r.AjaxDispatcher(this.container.dataset.objectGroup),this.registerEvents()})}static getDelegatedEventTarget(e,t){let n;return null===(n=e.closest(t))&&e.matches(t)&&(n=e),n}static getInlineRecordContainer(e){return document.querySelector('[data-object-id="'+e+'"]')}static registerInfoButton(e){let t;null!==(t=S.getDelegatedEventTarget(e.target,m.infoWindowButton))&&(e.preventDefault(),e.stopImmediatePropagation(),d.showItem(t.dataset.infoTable,t.dataset.infoUid))}static toggleElement(e){const t=S.getInlineRecordContainer(e);t.classList.contains(f.collapsed)?(t.classList.remove(f.collapsed),t.classList.add(f.visible)):(t.classList.remove(f.visible),t.classList.add(f.collapsed))}static isNewRecord(e){return S.getInlineRecordContainer(e).classList.contains(f.new)}static updateExpandedCollapsedStateLocally(e,t){const n=S.getInlineRecordContainer(e),i="uc[inlineView]["+n.dataset.topmostParentTable+"]["+n.dataset.topmostParentUid+"]"+n.dataset.fieldName,r=document.getElementsByName(i);r.length&&(r[0].value=t?"1":"0")}static getValuesFromHashMap(e){return Object.keys(e).map(t=>e[t])}static selectOptionValueExists(e,t){return null!==e.querySelector('option[value="'+t+'"]')}static removeSelectOptionByValue(e,t){const n=e.querySelector('option[value="'+t+'"]');null!==n&&n.remove()}static reAddSelectOption(e,t,n){if(S.selectOptionValueExists(e,t))return;const i=e.querySelectorAll("option");let r=-1;for(let e of Object.keys(n.possible)){if(e===t)break;for(let t=0;t<i.length;++t){if(i[t].value===e){r=t;break}}}-1===r?r=0:r<i.length&&r++;const o=document.createElement("option");o.text=n.possible[t],o.value=t,e.insertBefore(o,e.options[r])}registerEvents(){if(this.container.addEventListener("click",e=>{this.registerToggle(e),this.registerSort(e),this.registerCreateRecordButton(e),this.registerEnableDisableButton(e),S.registerInfoButton(e),this.registerDeleteButton(e),this.registerSynchronizeLocalize(e),this.registerRevertUniquenessAction(e)}),this.container.addEventListener("change",e=>{this.registerCreateRecordBySelector(e),this.registerUniqueSelectFieldChanged(e)}),window.addEventListener("message",this.handlePostMessage),this.getAppearance().useSortable){const e=document.querySelector("#"+this.container.getAttribute("id")+"_records");new a(e,{group:e.getAttribute("id"),handle:".sortableHandle",onSort:()=>{this.updateSorting()}})}}registerToggle(e){if(S.getDelegatedEventTarget(e.target,m.controlSectionSelector))return;let t;null!==(t=S.getDelegatedEventTarget(e.target,m.toggleSelector))&&(e.preventDefault(),e.stopImmediatePropagation(),this.loadRecordDetails(t.parentElement.dataset.objectId))}registerSort(e){let t;null!==(t=S.getDelegatedEventTarget(e.target,m.controlSectionSelector+' [data-action="sort"]'))&&(e.preventDefault(),e.stopImmediatePropagation(),this.changeSortingByButton(t.closest("[data-object-id]").dataset.objectId,t.dataset.direction))}registerCreateRecordButton(e){let t;if(null!==(t=S.getDelegatedEventTarget(e.target,m.createNewRecordButtonSelector))&&(e.preventDefault(),e.stopImmediatePropagation(),this.isBelowMax())){let e=this.container.dataset.objectGroup;void 0!==t.dataset.recordUid&&(e+=b.structureSeparator+t.dataset.recordUid),this.importRecord([e],t.dataset.recordUid)}}registerCreateRecordBySelector(e){let t;if(null===(t=S.getDelegatedEventTarget(e.target,m.createNewRecordBySelectorSelector)))return;e.preventDefault(),e.stopImmediatePropagation();const n=t,i=n.options[n.selectedIndex].getAttribute("value");this.importRecord([this.container.dataset.objectGroup,i])}createRecord(e,t,n=null,i=null){let r=this.container.dataset.objectGroup;null!==n&&(r+=b.structureSeparator+n),null!==n?(S.getInlineRecordContainer(r).insertAdjacentHTML("afterend",t),this.memorizeAddRecord(e,n,i)):(document.querySelector("#"+this.container.getAttribute("id")+"_records").insertAdjacentHTML("beforeend",t),this.memorizeAddRecord(e,null,i))}async importRecord(e,t){this.ajaxDispatcher.send(this.ajaxDispatcher.newRequest(this.ajaxDispatcher.getEndpoint("record_inline_create")),e).then(async e=>{this.isBelowMax()&&(this.createRecord(e.compilerInput.uid,e.data,void 0!==t?t:null,void 0!==e.compilerInput.childChildUid?e.compilerInput.childChildUid:null),s.reinitialize(),s.Validation.initializeInputFields(),s.Validation.validate())})}registerEnableDisableButton(e){let t;if(null===(t=S.getDelegatedEventTarget(e.target,m.enableDisableRecordButtonSelector)))return;e.preventDefault(),e.stopImmediatePropagation();const n=t.closest("[data-object-id]").dataset.objectId,i=S.getInlineRecordContainer(n),r="data"+i.dataset.fieldName+"["+t.dataset.hiddenField+"]",o=document.querySelector('[data-formengine-input-name="'+r+'"'),a=document.querySelector('[name="'+r+'"');null!==o&&null!==a&&(o.checked=!o.checked,a.value=o.checked?"1":"0",TBE_EDITOR.fieldChanged_fName(r,r));const s="t3-form-field-container-inline-hidden";let l="";i.classList.contains(s)?(l="actions-edit-hide",i.classList.remove(s)):(l="actions-edit-unhide",i.classList.add(s)),c.getIcon(l,c.sizes.small).then(e=>{t.replaceChild(document.createRange().createContextualFragment(e),t.querySelector(".t3js-icon"))})}registerDeleteButton(e){let t;if(null===(t=S.getDelegatedEventTarget(e.target,m.deleteRecordButtonSelector)))return;e.preventDefault(),e.stopImmediatePropagation();const n=TYPO3.lang["label.confirm.delete_record.title"]||"Delete this record?",i=TYPO3.lang["label.confirm.delete_record.content"]||"Are you sure you want to delete this record?";u.confirm(n,i,h.warning,[{text:TYPO3.lang["buttons.confirm.delete_record.no"]||"Cancel",active:!0,btnClass:"btn-default",name:"no"},{text:TYPO3.lang["buttons.confirm.delete_record.yes"]||"Yes, delete this record",btnClass:"btn-warning",name:"yes"}]).on("button.clicked",e=>{if("yes"===e.target.name){const e=t.closest("[data-object-id]").dataset.objectId;this.deleteRecord(e)}u.dismiss()})}registerSynchronizeLocalize(e){let t;null!==(t=S.getDelegatedEventTarget(e.target,m.synchronizeLocalizeRecordButtonSelector))&&this.ajaxDispatcher.send(this.ajaxDispatcher.newRequest(this.ajaxDispatcher.getEndpoint("record_inline_synchronizelocalize")),[this.container.dataset.objectGroup,t.dataset.type]).then(async e=>{document.querySelector("#"+this.container.getAttribute("id")+"_records").insertAdjacentHTML("beforeend",e.data);const t=this.container.dataset.objectGroup+b.structureSeparator;for(let n of e.compilerInput.delete)this.deleteRecord(t+n,!0);for(let n of e.compilerInput.localize){if(void 0!==n.remove){const e=S.getInlineRecordContainer(t+n.remove);e.parentElement.removeChild(e)}this.memorizeAddRecord(n.uid,null,n.selectedValue)}})}registerUniqueSelectFieldChanged(e){let t;if(null===(t=S.getDelegatedEventTarget(e.target,m.uniqueValueSelectors)))return;const n=t.closest("[data-object-id]");if(null!==n){const e=n.dataset.objectId,i=n.dataset.objectUid;this.handleChangedField(t,e);const r=this.getFormFieldForElements();if(null===r)return;this.updateUnique(t,r,i)}}registerRevertUniquenessAction(e){let t;null!==(t=S.getDelegatedEventTarget(e.target,m.revertUniqueness))&&this.revertUnique(t.dataset.uid)}loadRecordDetails(e){const t=document.querySelector("#"+e+"_fields"),n=void 0!==this.requestQueue[e];if(null!==t&&"\x3c!--notloaded--\x3e"!==t.innerHTML.substr(0,16))this.collapseExpandRecord(e);else{const i=this.getProgress(e);if(n)this.requestQueue[e].abort(),delete this.requestQueue[e],delete this.progessQueue[e],i.done();else{const n=this.ajaxDispatcher.newRequest(this.ajaxDispatcher.getEndpoint("record_inline_details"));this.ajaxDispatcher.send(n,[e]).then(async n=>{if(delete this.requestQueue[e],delete this.progessQueue[e],t.innerHTML=n.data,this.collapseExpandRecord(e),i.done(),s.reinitialize(),s.Validation.initializeInputFields(),s.Validation.validate(),this.hasObjectGroupDefinedUniqueConstraints()){const t=S.getInlineRecordContainer(e);this.removeUsed(t)}}),this.requestQueue[e]=n,i.start()}}}collapseExpandRecord(e){const t=S.getInlineRecordContainer(e),n=!0===this.getAppearance().expandSingle,i=t.classList.contains(f.collapsed);let r=[];const o=[];n&&i&&(r=this.collapseAllRecords(t.dataset.objectUid)),S.toggleElement(e),S.isNewRecord(e)?S.updateExpandedCollapsedStateLocally(e,i):i?o.push(t.dataset.objectUid):i||r.push(t.dataset.objectUid),this.ajaxDispatcher.send(this.ajaxDispatcher.newRequest(this.ajaxDispatcher.getEndpoint("record_inline_expandcollapse")),[e,o.join(","),r.join(",")])}memorizeAddRecord(e,t=null,i=null){const r=this.getFormFieldForElements();if(null===r)return;let o=p.trimExplode(",",r.value);if(t){const n=[];for(let i=0;i<o.length;i++)o[i].length&&n.push(o[i]),t===o[i]&&n.push(e);o=n}else o.push(e);r.value=o.join(","),r.classList.add("has-change"),n(document).trigger("change"),this.redrawSortingButtons(this.container.dataset.objectGroup,o),this.setUnique(e,i),this.isBelowMax()||this.toggleContainerControls(!1),TBE_EDITOR.fieldChanged_fName(r.name,r)}memorizeRemoveRecord(e){const t=this.getFormFieldForElements();if(null===t)return[];let i=p.trimExplode(",",t.value);const r=i.indexOf(e);return r>-1&&(delete i[r],t.value=i.join(","),t.classList.add("has-change"),n(document).trigger("change"),this.redrawSortingButtons(this.container.dataset.objectGroup,i)),i}changeSortingByButton(e,t){const n=S.getInlineRecordContainer(e),i=n.dataset.objectUid,r=document.querySelector("#"+this.container.getAttribute("id")+"_records"),o=Array.from(r.children).map(e=>e.dataset.objectUid);let a=o.indexOf(i),s=!1;if(t===v.UP&&a>0?(o[a]=o[a-1],o[a-1]=i,s=!0):t===v.DOWN&&a<o.length-1&&(o[a]=o[a+1],o[a+1]=i,s=!0),s){const e=this.container.dataset.objectGroup+b.structureSeparator,i=t===v.UP?1:0;n.parentElement.insertBefore(S.getInlineRecordContainer(e+o[a-i]),S.getInlineRecordContainer(e+o[a+1-i])),this.updateSorting()}}updateSorting(){const e=this.getFormFieldForElements();if(null===e)return;const t=document.querySelector("#"+this.container.getAttribute("id")+"_records"),i=Array.from(t.children).map(e=>e.dataset.objectUid);e.value=i.join(","),e.classList.add("has-change"),n(document).trigger("inline:sorting-changed"),n(document).trigger("change"),this.redrawSortingButtons(this.container.dataset.objectGroup,i)}deleteRecord(e,t=!1){const n=S.getInlineRecordContainer(e),i=n.dataset.objectUid;if(n.classList.add("t3js-inline-record-deleted"),!S.isNewRecord(e)&&!t){const e=this.container.querySelector('[name="cmd'+n.dataset.fieldName+'[delete]"]');e.removeAttribute("disabled"),n.parentElement.insertAdjacentElement("afterbegin",e)}n.addEventListener("transitionend",()=>{n.parentElement.removeChild(n),l.validate()}),this.revertUnique(i),this.memorizeRemoveRecord(i),n.classList.add("form-irre-object--deleted"),this.isBelowMax()&&this.toggleContainerControls(!0)}toggleContainerControls(e){this.container.querySelectorAll(m.controlContainerButtons+" a").forEach(t=>{t.style.display=e?null:"none"})}getProgress(e){const t="#"+e+"_header";let n;return void 0!==this.progessQueue[e]?n=this.progessQueue[e]:((n=o).configure({parent:t,showSpinner:!1}),this.progessQueue[e]=n),n}collapseAllRecords(e){const t=this.getFormFieldForElements(),n=[];if(null!==t){const i=p.trimExplode(",",t.value);for(let t of i){if(t===e)continue;const i=this.container.dataset.objectGroup+b.structureSeparator+t,r=S.getInlineRecordContainer(i);r.classList.contains(f.visible)&&(r.classList.remove(f.visible),r.classList.add(f.collapsed),S.isNewRecord(i)?S.updateExpandedCollapsedStateLocally(i,!1):n.push(t))}}return n}getFormFieldForElements(){const e=document.getElementsByName(this.container.dataset.formField);return e.length>0?e[0]:null}redrawSortingButtons(e,t=[]){if(0===t.length){const e=this.getFormFieldForElements();null!==e&&(t=p.trimExplode(",",e.value))}0!==t.length&&t.forEach((n,i)=>{const r="#"+e+b.structureSeparator+n+"_header",o=document.querySelector(r),a=o.querySelector('[data-action="sort"][data-direction="'+v.UP+'"]');if(null!==a){let e="actions-move-up";0===i?(a.classList.add("disabled"),e="empty-empty"):a.classList.remove("disabled"),c.getIcon(e,c.sizes.small).then(e=>{a.replaceChild(document.createRange().createContextualFragment(e),a.querySelector(".t3js-icon"))})}const s=o.querySelector('[data-action="sort"][data-direction="'+v.DOWN+'"]');if(null!==s){let e="actions-move-down";i===t.length-1?(s.classList.add("disabled"),e="empty-empty"):s.classList.remove("disabled"),c.getIcon(e,c.sizes.small).then(e=>{s.replaceChild(document.createRange().createContextualFragment(e),s.querySelector(".t3js-icon"))})}})}isBelowMax(){const e=this.getFormFieldForElements();if(null===e)return!0;if(void 0!==TYPO3.settings.FormEngineInline.config[this.container.dataset.objectGroup]){if(p.trimExplode(",",e.value).length>=TYPO3.settings.FormEngineInline.config[this.container.dataset.objectGroup].max)return!1;if(this.hasObjectGroupDefinedUniqueConstraints()){const e=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup];if(e.used.length>=e.max&&e.max>=0)return!1}}return!0}isUniqueElementUsed(e,t){if(!this.hasObjectGroupDefinedUniqueConstraints())return!1;const n=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup],i=S.getValuesFromHashMap(n.used);if("select"===n.type&&-1!==i.indexOf(e))return!0;if("groupdb"===n.type)for(let n=i.length-1;n>=0;n--)if(i[n].table===t&&i[n].uid===e)return!0;return!1}removeUsed(e){if(!this.hasObjectGroupDefinedUniqueConstraints())return;const t=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup];if("select"!==t.type)return;let n=e.querySelector('[name="data['+t.table+"]["+e.dataset.objectUid+"]["+t.field+']"]');const i=S.getValuesFromHashMap(t.used);if(null!==n){const e=n.options[n.selectedIndex].value;for(let t of i)t!==e&&S.removeSelectOptionByValue(n,t)}}setUnique(e,t){if(!this.hasObjectGroupDefinedUniqueConstraints())return;const n=document.querySelector("#"+this.container.dataset.objectGroup+"_selector"),i=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup];if("select"===i.type){if(!i.selector||-1!==i.max){const r=this.getFormFieldForElements(),o=this.container.dataset.objectGroup+b.structureSeparator+e;let a=S.getInlineRecordContainer(o).querySelector('[name="data['+i.table+"]["+e+"]["+i.field+']"]');const s=S.getValuesFromHashMap(i.used);if(null!==n){if(null!==a){for(let e of s)S.removeSelectOptionByValue(a,e);i.selector||(t=a.options[0].value,a.options[0].selected=!0,this.updateUnique(a,r,e),this.handleChangedField(a,this.container.dataset.objectGroup+"["+e+"]"))}for(let e of s)S.removeSelectOptionByValue(a,e);void 0!==i.used.length&&(i.used={}),i.used[e]={table:i.elTable,uid:t}}if(null!==r&&S.selectOptionValueExists(n,t)){const n=p.trimExplode(",",r.value);for(let r of n)null!==(a=document.querySelector('[name="data['+i.table+"]["+r+"]["+i.field+']"]'))&&r!==e&&S.removeSelectOptionByValue(a,t)}}}else"groupdb"===i.type&&(i.used[e]={table:i.elTable,uid:t});"select"===i.selector&&S.selectOptionValueExists(n,t)&&(S.removeSelectOptionByValue(n,t),i.used[e]={table:i.elTable,uid:t})}updateUnique(e,t,n){if(!this.hasObjectGroupDefinedUniqueConstraints())return;const i=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup],r=i.used[n];if("select"===i.selector){const t=document.querySelector("#"+this.container.dataset.objectGroup+"_selector");S.removeSelectOptionByValue(t,e.value),void 0!==r&&S.reAddSelectOption(t,r,i)}if(i.selector&&-1===i.max)return;if(!i||null===t)return;const o=p.trimExplode(",",t.value);let a;for(let t of o)null!==(a=document.querySelector('[name="data['+i.table+"]["+t+"]["+i.field+']"]'))&&a!==e&&(S.removeSelectOptionByValue(a,e.value),void 0!==r&&S.reAddSelectOption(a,r,i));i.used[n]=e.value}revertUnique(e){if(!this.hasObjectGroupDefinedUniqueConstraints())return;const t=TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup],n=this.container.dataset.objectGroup+b.structureSeparator+e,i=S.getInlineRecordContainer(n);let r=i.querySelector('[name="data['+t.table+"]["+i.dataset.objectUid+"]["+t.field+']"]');if("select"===t.type){let n;if(null!==r)n=r.value;else{if(""===i.dataset.tableUniqueOriginalValue)return;n=i.dataset.tableUniqueOriginalValue}if("select"===t.selector&&!isNaN(parseInt(n,10))){const e=document.querySelector("#"+this.container.dataset.objectGroup+"_selector");S.reAddSelectOption(e,n,t)}if(t.selector&&-1===t.max)return;const o=this.getFormFieldForElements();if(null===o)return;const a=p.trimExplode(",",o.value);let s;for(let e=0;e<a.length;e++)null!==(s=document.querySelector('[name="data['+t.table+"]["+a[e]+"]["+t.field+']"]'))&&S.reAddSelectOption(s,n,t);delete t.used[e]}else"groupdb"===t.type&&delete t.used[e]}hasObjectGroupDefinedUniqueConstraints(){return void 0!==TYPO3.settings.FormEngineInline.unique&&void 0!==TYPO3.settings.FormEngineInline.unique[this.container.dataset.objectGroup]}handleChangedField(e,t){let n;n=e instanceof HTMLSelectElement?e.options[e.selectedIndex].text:e.value,document.querySelector("#"+t+"_label").textContent=n.length?n:this.noTitleString}getAppearance(){if(null===this.appearance&&(this.appearance={},"string"==typeof this.container.dataset.appearance))try{this.appearance=JSON.parse(this.container.dataset.appearance)}catch(e){console.error(e)}return this.appearance}}return S}));